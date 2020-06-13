import {Controller, Get, PathParams, Post, QueryParams} from "@tsed/common";
import {AuthenticationService} from "../../partner-platform/services/AuthenticationService";
import {IUser, IUserAuth} from "../../partner-platform/models/User";
import {Guid} from "../../partner-platform/models/Guid";

@Controller("/auth")
export class AuthenticationController {

    public constructor(
        private readonly authenticationService: AuthenticationService) {
    }

    @Post("/phone")
    async registerUserPhone(request: Express.Request, response: Express.Response) {
        const register : {phone: string} = request['body'];
        return await this.authenticationService.registerUserPhone(register.phone);
    }

    @Post("/signIn")
    async signIn(request: Express.Request, response: Express.Response) {
        const credentials: { phone: number, hashCode: string } = request['body'];
        return await this.authenticationService.signIn(credentials.phone, credentials.hashCode);
    }



}

