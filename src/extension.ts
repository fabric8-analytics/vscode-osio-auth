import * as vscode from "vscode";

import { ServerHTML } from "./server";
import { Utility } from "./utility";
import { ApiServer } from "./server-api";
import { authextension } from './authextension';

export function activate(context: vscode.ExtensionContext) : any{
    // instantiate web server
    //let apiServer = new ApiServer(context);

    let disposable1: any = vscode.commands.registerCommand("extension.osioAuthorize", () => {
        triggerAuthOSIO(context);
    });

    initAuthStatusBar("Openshift.io","extension.osioAuthorize");
    let logInStatus = checkLastloggedIn();
    console.log("------------logInStatus---------");
    console.log(logInStatus);

    let disposable2: any = vscode.commands.registerCommand("extension.osioUnauthorize", () => {
        context.globalState.update("osio_token_meta", "");
        triggerAuthStatusBar("extension.osioAuthorize");
        vscode.window.showInformationMessage("Successfully unauthorized extension form OSIO.");
    });

    let disposable3: any = vscode.commands.registerCommand("extension.stop", () => {
        ApiServer.stop();
        ServerHTML.stop();
        vscode.window.showInformationMessage("Stop the Web Server successfully.");
    });

    let disposable4: any = vscode.commands.registerCommand("extension.resume", () => {
        resumeServer();
        vscode.window.showInformationMessage("Resume the Web Server.");
    });

    context.subscriptions.push(disposable1, disposable2, disposable3, disposable4);

    // Stop the servers
    ApiServer.stop();
    ServerHTML.stop();

    function checkLastloggedIn(){

        //let api_token = context.globalState.get("osio_refrsh_token");
        let api_token_meta: any = context.globalState.get("osio_token_meta");
        if(api_token_meta.hasOwnProperty("refresh_token") && api_token_meta.hasOwnProperty("api_timestamp")){
            triggerAuthStatusBar("extension.osioUnauthorize");
            //todo :: check if diff is 24 hours
            let api_ts_date: Date = new Date(api_token_meta["api_timestamp"]);
            let cur_ts_date: Date = new Date();
            let timeDiff: number = Math.abs(cur_ts_date.getMinutes() - api_ts_date.getMinutes());
            console.log("-------timeDiff------"); //1440
            console.log(timeDiff);
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
            vscode.window.showInformationMessage("Authorize for Openshift.io","Authorize OSIO").then((selection:any) => {
                if(selection == "Authorize OSIO"){
                    triggerAuthOSIO(context);
                }
            })
            return null;
        }
    }

}

function triggerAuthOSIO(context: any) {
    console.log(">>>>>>>>>>>>>>>>>>server started<<<<<<<<<<<<<<<<");
    startServer();
    ApiServer.start(context);
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://auth.openshift.io/api/login?api_client=vscode&redirect=http://localhost:45032/out/src/osio-ide.html"));
        
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
    //f8AnalyticsStatusBarItem.show();
}

function startServer() {
    Utility.setRandomPort();
    const options = vscode.workspace.getConfiguration("previewServer");
    const port = options.get("port") as number;
    const proxy = options.get("proxy") as string;
    const isSync = options.get("sync") as boolean;
    const rootPath = vscode.workspace.rootPath || Utility.getOpenFilePath(vscode.window.activeTextEditor.document.fileName);

    ServerHTML.start(rootPath, port, isSync, proxy);
}

function resumeServer() {
    ServerHTML.stop();
    startServer();
}

export function deactivate() {
    ServerHTML.stop();
}
