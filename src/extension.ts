import * as vscode from "vscode";

import { Server } from "./server";
import { Utility } from "./utility";
import { ApiServer } from "./server-api";

export function activate(context: vscode.ExtensionContext) {
    // instantiate web server
    let apiServer = new ApiServer(context);

    let disposable2: any = vscode.commands.registerCommand("extension.launch", () => {
        // start web server
        startServer();
        apiServer.start();
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://auth.prod-preview.openshift.io/api/login?api_client=vscode&redirect=http://localhost:8080/out/src/osio-ide.html"));
        setTimeout(() => {
            // Stop the servers
            apiServer.stop();
            Server.stop();
          }, 15000);

    });

    let disposable3: any = vscode.commands.registerCommand("extension.stop", () => {
        Server.stop();
        vscode.window.showInformationMessage("Stop the Web Server successfully.");
    });

    let disposable4: any = vscode.commands.registerCommand("extension.resume", () => {
        resumeServer();
        vscode.window.showInformationMessage("Resume the Web Server.");
    });

    context.subscriptions.push(disposable2, disposable3, disposable4);

    // Stop the servers
    apiServer.stop();
    Server.stop();

    let api_token = context.globalState.get("osio_refrsh_token");
    return api_token;
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
