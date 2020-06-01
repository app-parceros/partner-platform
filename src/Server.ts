import {GlobalAcceptMimesMiddleware, Module, ServerLoader} from "@tsed/common";
import * as http from "http";
import {configuration} from "./partner-platform/config/serviceAccountKey";


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
            methodOverride = require('method-override'),
            {createProxyMiddleware} = require('http-proxy-middleware');

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
            .use(
                '/maps',
                createProxyMiddleware({
                        target: 'https://maps.googleapis.com',
                        changeOrigin: true,
                        onProxyReq: function (proxyReq: http.ClientRequest, req: Request, res: Response) {
                            proxyReq.path = `${proxyReq.path}&key=${configuration.maps_api_key}`
                        }
                    }
                )
            )
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }
}
