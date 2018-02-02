import * as vscode from "vscode";

import { ApiServer } from "./server-api";
import { authextension } from './authextension';

export function activate(context: vscode.ExtensionContext) : any {
    
    let disposable1: any = vscode.commands.registerCommand("extension.osioAuthorize", () => {
        let api_token_meta: any = context.globalState.get("osio_token_meta");
        triggerAuthOSIO(context, api_token_meta);
    });

    initAuthStatusBar("OpenShift.io","extension.osioAuthorize");
    let logInStatus = checkLastloggedIn();

    let disposable2: any = vscode.commands.registerCommand("extension.osioUnauthorize", () => {

        let logInStatus = checkLastloggedIn();
        if(logInStatus && logInStatus.hasOwnProperty("refresh_token")){
            vscode.window.showInformationMessage("You are authorized with OpenShift.io, would you like to unauthorize","Unauthorize").then((selection:any) => {
                if(selection == "Unauthorize"){
                    context.globalState.update("osio_token_meta", "");
                    //triggerAuthStatusBar("extension.osioAuthorize");
                    vscode.window.showInformationMessage("Successfully unauthorized extension form OpenShift.io. Please reload","Reload").then((selection:any) => {
                        if(selection == "Reload"){
                            //triggerAuthOSIO(context);
                            vscode.commands.executeCommand('workbench.action.reloadWindow');
                        }
                    });
                }
            })
        } else {
            triggerAuthStatusBar("extension.osioUnauthorize");
        }
    });

    let disposable3: any = vscode.commands.registerCommand("extension.stop", () => {
        ApiServer.stop();
        vscode.window.showInformationMessage("Stop the Web Server successfully.");
    });

    context.subscriptions.push(disposable1, disposable2, disposable3);

    // Stop the servers
    ApiServer.stop();

    function checkLastloggedIn(){
        let api_token_meta: any = context.globalState.get("osio_token_meta");
        if(api_token_meta && api_token_meta.hasOwnProperty("refresh_token") && api_token_meta.hasOwnProperty("api_timestamp")){
            triggerAuthStatusBar("extension.osioUnauthorize");
            //check if diff is 24 hours
            let api_ts_date: Date = new Date(api_token_meta["api_timestamp"]);
            let cur_ts_date: Date = new Date();
            let timeDiff: number = Math.abs(cur_ts_date.getMinutes() - api_ts_date.getMinutes());
            if(timeDiff>=1440){
                authextension.authorize_OSIO(api_token_meta, context, (data:any) => {
                    let api_token_cur = context.globalState.get("osio_token_meta");
                    return api_token_cur;
                });
            } else{
                return api_token_meta;
            }
        } else {
            triggerAuthStatusBar("extension.osioAuthorize");
            vscode.window.showInformationMessage("Authorize for OpenShift.io","Authorize").then((selection:any) => {
                if(selection == "Authorize"){
                    triggerAuthOSIO(context, api_token_meta);
                }
            })
            return null;
        }
    }

    return logInStatus;

}

function triggerAuthOSIO(context: any, api_token_meta: any) {
    authextension.authorize_OSIO(api_token_meta, context, (data:any) => {
        let api_token_cur = context.globalState.get("osio_token_meta");
        return api_token_cur;
    });
    console.log(">>>>>>>>>>>>>>>>>>server started<<<<<<<<<<<<<<<<");
    ApiServer.start(context);
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://auth.openshift.io/api/login?api_client=vscode&redirect=http://localhost:45036/osioide"));
        
}

export let f8AnalyticsStatusBarItem: vscode.StatusBarItem;

export function initAuthStatusBar(title: string, cmd: string){
  f8AnalyticsStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
  f8AnalyticsStatusBarItem.command = cmd;
  f8AnalyticsStatusBarItem.text = title;
  f8AnalyticsStatusBarItem.tooltip = title;
  f8AnalyticsStatusBarItem.show();
}

export function triggerAuthStatusBar(cmd: string){
    f8AnalyticsStatusBarItem.command = cmd;
}

