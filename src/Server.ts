import {
    Configuration,
    GlobalAcceptMimesMiddleware,
    Inject,
    PlatformApplication
} from "@tsed/common";
import * as http from "http";
import {configuration} from "./partner-platform/config/FirebaseConfig";
import Path from "path";
import "@tsed/swagger";

const PORT = process.env.PORT || 4200;

@Configuration(
    {
        rootDir: Path.resolve(__dirname),
        mount: {
            "/api": ["${rootDir}/**/controllers/**\/*.ts",
                // ResourceController // support manual import
            ]
        },
        componentsScan: [
            "${rootDir}/**/services/**\/*.ts",
            // "${rootDir}/**/persistence/**\/*.ts",
            "${rootDir}/**/middlewares/**\/*.ts",
        ],
        statics: {
            "/": Path.join(__dirname, "partner-platform.web")
        },
        acceptMimes: ["application/json", "multipart/form-data"],
        port: PORT,
        swagger: [
            {
                path: "/api-docs"
            }
        ]
    }
)
export class Server {
    /**
     * This method lets you configure the middleware required for your application to work.
     * @returns {Server}
     */
    @Inject()
    app: PlatformApplication;

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

        this.app
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
