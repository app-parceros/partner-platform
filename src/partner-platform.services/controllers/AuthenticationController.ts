import {Controller, Get, PathParams, Post, QueryParams} from "@tsed/common";
import {AuthenticationService} from "../../partner-platform/services/AuthenticationService";
import {IUser, IUserAuth} from "../../partner-platform/models/User";
import {Guid} from "../../partner-platform/models/Guid";

@Controller("/auth")
export class AuthenticationController {

    public constructor(
        private readonly authenticationService: AuthenticationService) {
    }

    @Post("/user")
    async createUserRegister(request: Express.Request, response: Express.Response) {
        const user: IUserAuth = request['body'];
        return await this.authenticationService.createUser(user);
    }

    @Post("/signIn")
    async signIn(request: Express.Request, response: Express.Response) {
        const user: IUserAuth = request['body'];
        return await this.authenticationService.signIn(user);
    }



}

