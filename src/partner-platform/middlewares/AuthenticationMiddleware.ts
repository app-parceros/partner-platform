import {EndpointInfo, IMiddleware, Middleware, Req, Res} from "@tsed/common";
import {configuration as authConfig} from "../config/AuthTokenConfig";
const jwt = require("jsonwebtoken");

@Middleware()
export class AuthenticationMiddleware implements IMiddleware {
    use(@Req() request: Req, @Res() response: Res, @EndpointInfo() endpoint: EndpointInfo) {

        // get the parameters stored for the current endpoint or on the controller.
        try {
            const token = request.headers.authorization.split(" ")[1];
            jwt.verify(token, authConfig.jwtSecret);
        } catch (e) {
            response.status(401).json({message: "No token provided"});
        }
    }
}
