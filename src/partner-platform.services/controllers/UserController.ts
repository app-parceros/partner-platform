import {BodyParams, Controller, Get, PathParams, Post, UseBefore} from "@tsed/common";
import {IPosition} from "../../partner-platform/models/Location";
import {UserService} from "../../partner-platform/services/UserService";
import {IUser} from "../../partner-platform/models/User";
import {v4 as uuid} from 'uuid';
import {Guid} from "../../partner-platform/models/Guid";
import {AuthenticationMiddleware} from "../../partner-platform/middlewares/AuthenticationMiddleware";
import {PushNotificationToken} from "../../partner-platform/models/PushNotificationToken";
import {Description, Returns, Summary} from "@tsed/swagger";

@Controller("/user")
export class UserController {

    public constructor(private readonly _userService: UserService) {
    }

    @Post("/")
    async createUser(request: Express.Request, response: Express.Response) {
        const user: IUser = request['body'];

        return await this._userService.createUser(user);
    }

    @Post("/:userId/position")
    async updateUserPosition(request: Express.Request, response: Express.Response) {
        const userPosition: IPosition = request['body'];
        console.log('------updateUserPosition', userPosition);
        return await this._userService.updateUserPosition(uuid(), userPosition);
    }


    @Get("/:userId")
    // @UseBefore(AuthenticationMiddleware)
    async getUser(@PathParams("userId") userId: Guid): Promise<any> {
        return await this._userService.getUserById(userId);
    }


    @Post("/:userId/token")
    @Summary("Register of Notification token for an user")
    @Description("Associate notification token with the user")
    async registerNotificationToken(
        @PathParams("userId") userId: Guid,
        @BodyParams() token: PushNotificationToken): Promise<any> {
        return await this._userService.registerNotificationToken(userId, token);
    }
}


