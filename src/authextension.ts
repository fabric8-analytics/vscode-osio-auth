'use strict';

import * as vscode from 'vscode';

import { Apiendpoint } from './apiendpoint';

export module authextension {

    const request = require('request');
    export let authorize_OSIO: any;
    export let refresh_access_token_osio: any;

    authorize_OSIO = (token_meta: any, context: any, cb: any) => {
        if(token_meta && token_meta.refresh_token) {
            Apiendpoint.OSIO_REFRESH_TOKEN = token_meta.refresh_token;
            refresh_access_token_osio(Apiendpoint, context, cb);
        } else {
            cb(null);
        }
    };


    refresh_access_token_osio = (Apiendpoint: any, context: any, cb: any) => {
        let bodyData: any = {'refresh_token': `${Apiendpoint.OSIO_REFRESH_TOKEN}`};
        let options: any = {};
        options['url'] = `${Apiendpoint.OSIO_AUTH_URL}`;
        options['method'] = 'POST';
        options['headers'] = {'Content-Type': 'application/json'};
        options['body'] = JSON.stringify(bodyData);
        request(options, (err: any, httpResponse: any, body: any) => {
            if(err){
                cb(null);
            }else{
                if ((httpResponse.statusCode === 200 || httpResponse.statusCode === 202)) {
                    let resp = JSON.parse(body);
                    if (resp && resp.token) {
                        context.globalState.update('osio_token_meta', resp);
                        cb(true);
                    } else {
                        vscode.window.showErrorMessage(`Failed with Status code : ${httpResponse.statusCode}`);
                        cb(null);
                    }
                } else if(httpResponse.statusCode === 401){
                    vscode.window.showErrorMessage(`Looks like your token is not proper, kindly authorize again`);
                    cb(null);
                } else {   
                    vscode.window.showErrorMessage(`Looks like your token is not proper, kindly authorize again, Status: ${httpResponse.statusCode}`);
                    cb(null);
                }
            }
        });
    };
}
