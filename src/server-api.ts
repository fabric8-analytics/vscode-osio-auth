import * as express from "express";
import {GET, Path, PathParam, Server } from "typescript-rest";
import * as http from "http";
import * as path from "path";
import * as cors from "cors";
import * as vscode from "vscode";

let contextToken: any;

export class ApiServer {

    private app: express.Application;
    private server: http.Server = null;
    public PORT: number = process.env.PORT || 3000;

    constructor(context: any) {
        this.app = express();
        this.config();
        contextToken = context || "";
        Server.buildServices(this.app, TokenController);
    }

    /**
     * Configure the express app.
     */
    private config(): void {
        // Native Express configuration
        this.app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));
        this.app.use(cors());
    }

    /**
     * Start the server
     * @returns {Promise<any>}
     */
    public start(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: any) => {
                if (err) {
                    return reject(err);
                }
                // tslint:disable-next-line:no-console
                console.log(`Listening to http://${this.server.address().address}:${this.server.address().port}`);
                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

}

/**
 * This is a demo operation to show how to use typescript-rest library.
 */
@Path('/refreshtoken')
export class TokenController {
    /**
     * Send a greeting message.
     * @param name The name that will receive our greeting message
     */
    @Path(':token')
    @GET
    sayHello(@PathParam('token') data: string): string {
        let token_meta: any = JSON.parse(data);
        contextToken.globalState.update("osio_refrsh_token", token_meta.refresh_token);
        vscode.window.showInformationMessage("Great!! Authorization was successful from OSIO");
        return "sucess";
    }
}
