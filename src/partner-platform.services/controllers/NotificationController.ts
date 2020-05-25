import {Controller, Get, Post} from "@tsed/common";
import {NotificationService} from "../../partner-platform/services/NotificationService";

@Controller("/notification")
export class NotificationController {

    public constructor(private readonly _notificationService: NotificationService) {

    }


    @Post("/")
    async sendNotificationToUser(request: Express.Request, response: Express.Response) {

        await this._notificationService.sendNotificationToUser("my message");
        return {};
    }
}


