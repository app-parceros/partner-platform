import {GlobalAcceptMimesMiddleware, Module, ServerLoader} from "@tsed/common";

@Module({})
export class Server extends ServerLoader {
    /**
     * This method lets you configure the middleware required for your application to work.
     * @returns {Server}
     */
    public $beforeRoutesInit(): void | Promise<any> {
        const //cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            //compress = require('compression'),
            cors = require("cors"),
            methodOverride = require('method-override');


        const corsOptions = {
            origin: function (origin, callback) {
                console.log('************', origin);
                callback(null, true);
            }
        }

        this
            .use(GlobalAcceptMimesMiddleware)
            // .use(cookieParser())
            //.use(compress({}))
            // .use(methodOverride())
            .use(cors(corsOptions))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }
}
