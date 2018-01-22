'use strict';

/**
 * Commonly used commands
 */
export namespace Template {
    /**
     * Template for redirect uri
     */
    export const REDIRECT_URI_TEMPLATE = `<!DOCTYPE HTML >
    <html>
        <head>
            <title>OSIO</title>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        </head>
    <body>
    <div style="margin:0 auto;width: 600px;margin-top: 200px;">
        <span>
            You have been successfully authenticated with <b><a href="openshift.io">Openshift.io</a></b>. You can safely close this page and return to editor.
        </span>
    </div>
    </body>
        <script>

        $(document).ready(function(){

        var request = (function() {
            var _get = {};
            var re = /[?&]([^=&]+)(=?)([^&]*)/g;
            while (m = re.exec(location.search))
                _get[decodeURIComponent(m[1])] = (m[2] == '=' ? decodeURIComponent(m[3]) : true);
            return _get;
        })();

        var token_meta = request.token_json?request.token_json : request.api_token;
        //var token_meta = request.api_token;
        var api_port = 45036;
        $.get("http://localhost:"+api_port+"/refreshtoken/"+ token_meta, function( data ) {
            window.close();
        });

        });
     </script>
    <html>`;

    }
