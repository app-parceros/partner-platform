import {Controller, Get, Post} from "@tsed/common";
import {FavorService} from "../../partner-platform/services/FavorService";
import {PushNotificationToken} from "../../partner-platform/models/PushNotificationToken";
import {IFavor} from "../../partner-platform/models/Favor";

@Controller("/favor")
export class NotificationController {

    public constructor(private readonly _favorService: FavorService) {
    }

    @Get("/")
    async getFavors(request: Express.Request, response: Express.Response) {

        const favorsResultSet = await this._favorService.getFavors();
        return favorsResultSet;
    }

    @Post("/")
    async createFavor(request: Express.Request, response: Express.Response) {
        const favor: IFavor = request['body'];
        const favorsResult = await this._favorService.createFavor(favor);
        return favorsResult;
    }

}


