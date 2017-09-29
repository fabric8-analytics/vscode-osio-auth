import * as browserSync from "browser-sync";
import * as vscode from "vscode";

export class Server {

    public static start(rootPath: string, port: number, isSync: boolean, proxy = "") {
        // get browserSync instance.
        let bs: browserSync.BrowserSyncInstance;
        if (!browserSync.has("osio-auth-service")) {
            bs = browserSync.create("osio-auth-service");
        } else {
            bs = browserSync.get("osio-auth-service");
        }

        let options: browserSync.Options;
        let myExtDir = vscode.extensions.getExtension ("redhat.osio-auth-service").extensionPath;
        if (proxy === "") {
            options = {
                server: {
                    baseDir: myExtDir,
                    directory: true
                },
                open: false,
                port: port,
                codeSync: isSync
            };
        } else {
            options = {
                proxy: proxy,
                serveStatic: ["."]
            };
        }

        bs.init(options, (err) => {
            if (err) {
                console.log(err);
                bs.notify("Error is occured.");
            }
        });
    }

    public static stop() {
        if (browserSync.has("osio-auth-service")) {
            browserSync.get("osio-auth-service").exit();
        }
    }

    public static reload(fileName: string) {
        if (browserSync.has("osio-auth-service")) {
            browserSync.get("osio-auth-service").reload(fileName);
        }
    }
}
