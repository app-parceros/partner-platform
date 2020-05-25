import {$log, ServerLoader} from "@tsed/common";
import {Server} from "./Server";
import * as Path from "path";

const Provider = require('oidc-provider');

// http://localhost:3000/auth?client_id=test_implicit_app&redirect_uri=https://testapp/signin-oidc&response_type=id_token&scope=openid%20profile%20&nonce=123%20&state=321
async function bootstrap() {
    try {
        $log.debug("Start server...");
        const PORT = process.env.PORT || 3000;
        const ISSUER = `http://localhost:${PORT}`;
        const clients = [{
            client_id: 'test_implicit_app',
            grant_types: ['implicit'],
            response_types: ['id_token'],
            redirect_uris: ['https://testapp/signin-oidc'],
            token_endpoint_auth_method: 'none'
        }];
        const functions = {
            async findById(ctx, id) {
                console.log("ctx",ctx);
                console.log("id",id);
                return {
                    accountId: id,
                    async claims() { return { sub: id }; },
                };
            }
        };

        const server = await ServerLoader.bootstrap(Server,
            {
                rootDir: Path.resolve(__dirname),
                mount: {
                    "/api": ["${rootDir}/**/controllers/**\/*.ts",
                        // ResourceController // support manual import
                    ]
                },
                componentsScan: [
                    "${rootDir}/**/services/**\/*.ts"
                ],
                statics: {
                    "/": Path.join(__dirname, "partner-platform.web")
                },
                acceptMimes: ["application/json", "multipart/form-data"],
                port: PORT,
            });
        const oidc = new Provider(ISSUER, {clients, ...functions});

        await server.listen();
        server.use(oidc.callback);
        $log.debug("Server initialized");
    } catch (er) {
        $log.error(er);
    }
}

bootstrap();
