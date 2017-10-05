import * as assert from "assert";
import * as vscode from "vscode";
import * as browserSync from "browser-sync";
import { Server } from "../src/server";

suite("OSIO Auth Extension", () => {

    test("Extension should be present", () => {
        assert.ok(vscode.extensions.getExtension("redhat.osio-auth-service"));
    });

    test("should activate", function () {
        this.timeout(1 * 60 * 1000);
        return vscode.extensions.getExtension("redhat.osio-auth-service").activate().then((api) => {
            assert.ok(true);
        });
    });
});

suite("Server Tests", () => {
    test("start server", () => {
        Server.start(".", 8888, true);
        assert.ok(browserSync.has("osio-auth-service"));
        Server.stop();
    });
});
