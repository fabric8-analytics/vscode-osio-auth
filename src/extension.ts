import * as vscode from "vscode";

import { Server } from "./server";
import { Utility } from "./utility";
import { ApiServer } from "./server-api";
import { authextension } from './authextension';

export function activate(context: vscode.ExtensionContext) : any{
    // instantiate web server
    let apiServer = new ApiServer(context);

    let disposable1: any = vscode.commands.registerCommand("extension.osioAuthorize", () => {
        // start web server
        console.log("server started");
        startServer();
        apiServer.start();
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://auth.openshift.io/api/login?api_client=vscode&redirect=http://localhost:45032/out/src/osio-ide.html"));
        setTimeout(() => {
            // Stop the servers
            console.log("server stopped");
            apiServer.stop();
            Server.stop();
          }, 55000);

    });

    let disposable2: any = vscode.commands.registerCommand("extension.osioUnauthorize", () => {
        context.globalState.update("osio_token_meta", "");
        vscode.window.showInformationMessage("Successfully unauthorized extension form OSIO.");
    });

    let disposable3: any = vscode.commands.registerCommand("extension.stop", () => {
        apiServer.stop();
        Server.stop();
        vscode.window.showInformationMessage("Stop the Web Server successfully.");
    });

    let disposable4: any = vscode.commands.registerCommand("extension.resume", () => {
        resumeServer();
        vscode.window.showInformationMessage("Resume the Web Server.");
    });

    context.subscriptions.push(disposable1, disposable2, disposable3, disposable4);

    // Stop the servers
    apiServer.stop();
    Server.stop();

    //let api_token = context.globalState.get("osio_refrsh_token");
    let api_token_meta = context.globalState.get("osio_token_meta");
    if(api_token_meta){
        authextension.authorize_OSIO(api_token_meta, context, (data:any) => {
        let api_token_cur = context.globalState.get("osio_token_meta");
        return api_token_cur;
        });
    } else {
        return null;
    }
}

function startServer() {
    Utility.setRandomPort();
    const options = vscode.workspace.getConfiguration("previewServer");
    const port = options.get("port") as number;
    const proxy = options.get("proxy") as string;
    const isSync = options.get("sync") as boolean;
    const rootPath = vscode.workspace.rootPath || Utility.getOpenFilePath(vscode.window.activeTextEditor.document.fileName);

    Server.start(rootPath, port, isSync, proxy);
}

function resumeServer() {
    Server.stop();
    startServer();
}

export function deactivate() {
    Server.stop();
}
