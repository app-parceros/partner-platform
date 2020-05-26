import {$log, ServerLoader} from "@tsed/common";
import {Server} from "./Server";
import * as Path from "path";

async function bootstrap() {
    try {
        $log.debug("Start server...");
        const PORT = process.env.PORT || 3000;

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

        await server.listen();
        $log.debug("Server initialized");
    } catch (er) {
        $log.error(er);
    }
}

bootstrap();
