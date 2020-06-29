import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express"; // import swagger Ts.ED module
import {Server} from "./Server";

async function validateEnvVars() {
    const envVars = process.env;
    Object.entries(envVars)
        .map(item => {
            if (item  && item[0].indexOf('partner_platform') >= 0){
                console.log(`${item[0]}:  ${item[1]} `);
            }
        })
}

async function bootstrap() {
    try {
        $log.debug("Start server...");
        const platform = await PlatformExpress.bootstrap(Server, {});
        await platform.listen();
        $log.debug("Server initialized");
    } catch (er) {
        $log.error(er);
    }
}
validateEnvVars();
bootstrap();
