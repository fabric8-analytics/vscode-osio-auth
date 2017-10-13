import * as express from "express";
import {GET, Path, PathParam, Server } from "typescript-rest";
import * as http from "http";
import * as path from "path";
import * as cors from "cors";
import * as vscode from "vscode";
import { ServerHTML } from "./server";
import { f8AnalyticsStatusBarItem } from "./extension";

//let contextToken: any;

export class ApiServer {

    public static app: express.Application;
    public static server: http.Server = null;
    public static contextToken: any;
    // dynamic ports (49152–65535)
    public static PORT: number = 45036;
    //process.env.APIPORT || 3000;

    // constructor(context: any) {
    //     this.app = express();
    //     this.config();
    //     contextToken = context || "";
    //     process.env.APIPORT = this.PORT;
    //     Server.buildServices(this.app, TokenController);
    // }

    /**
     * Configure the express app.
     */
    public  static  config(): void {
        // Native Express configuration
        ApiServer.app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));
        ApiServer.app.use(cors());
    }

    /**
     * Start the server
     * @returns {Promise<any>}
     */
    public  static start(context: any): Promise<any> {
        ApiServer.app = express();
        ApiServer.config();
        ApiServer.contextToken = context || "";
        process.env.APIPORT = ApiServer.PORT;
        Server.buildServices(ApiServer.app, TokenController);
        return new Promise<any>((resolve, reject) => {
            ApiServer.server = ApiServer.app.listen(ApiServer.PORT, (err: any) => {
                if (err) {
                    return reject(err);
                }
                // tslint:disable-next-line:no-console
                console.log(`Listening to http://${ApiServer.server.address().address}:${ApiServer.server.address().port}`);
                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public static stop(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (ApiServer.server) {
                ApiServer.server.close(() => {
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
@Path("/refreshtoken")
export class TokenController {
    /**
     * Send a greeting message.
     * @param name The name that will receive our greeting message
     */
    @Path(":token")
    @GET
    sayHello(@PathParam("token") data: string): string {
        let token_meta: any = JSON.parse(data);
        //contextToken.globalState.update("osio_refrsh_token", token_meta.refresh_token);
        let cur_api_ts: Date = new Date();
        token_meta["api_timestamp"] = cur_api_ts;
        ApiServer.contextToken.globalState.update("osio_token_meta", token_meta);
        vscode.window.showInformationMessage("Great!! Authorization was successful from OSIO");
        ServerHTML.stop();
        ApiServer.stop();
        f8AnalyticsStatusBarItem.hide();
        console.log("================ server stopped ================");
        return "sucess";
    }
}
