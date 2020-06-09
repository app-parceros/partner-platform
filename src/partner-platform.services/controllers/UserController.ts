import { Controller, Get, PathParams, Post} from "@tsed/common";
import {IPosition} from "../../partner-platform/models/Location";
import {UserService} from "../../partner-platform/services/UserService";
import {IUser} from "../../partner-platform/models/User";
import {v4 as uuid} from 'uuid';
import {Guid} from "../../partner-platform/models/Guid";

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
    async getUser(@PathParams("userId") userId: Guid): Promise<any> {
        return await this._userService.getUserById(userId);
    }
}


