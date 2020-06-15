import {BodyParams, Controller, Get, PathParams, Post, Put, UseBefore} from "@tsed/common";
import {IPosition} from "../../partner-platform/models/Location";
import {UserService} from "../../partner-platform/services/UserService";
import {IUser} from "../../partner-platform/models/User";
import {Guid} from "../../partner-platform/models/Guid";
import {AuthenticationMiddleware} from "../../partner-platform/middlewares/AuthenticationMiddleware";
import {PushNotificationToken} from "../../partner-platform/models/PushNotificationToken";
import {Description, Summary} from "@tsed/swagger";

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
    @Summary("Register position for an user")
    @Description("Associate position with the user")
    async updateUserPosition(
        @PathParams("userId") userId: Guid,
        @BodyParams() position: IPosition) {
        return await this._userService.updateUserPosition(userId, position);
    }

    @Put("/:userId")
    @Summary("Update profile for an user")
    @Description("Associate profile data with the user")
    // @UseBefore(AuthenticationMiddleware)
    async updateProfile(@PathParams("userId") userId: Guid,
                        @BodyParams() user: IUser): Promise<any> {
        return await this._userService.updateProfile(userId, user);
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


