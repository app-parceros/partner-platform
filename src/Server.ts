import {GlobalAcceptMimesMiddleware, Module, ServerLoader} from "@tsed/common";
@Module({})
export class Server extends ServerLoader {
    /**
     * This method lets you configure the middleware required for your application to work.
     * @returns {Server}
     */
    public $beforeRoutesInit(): void | Promise<any> {
        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }
}
