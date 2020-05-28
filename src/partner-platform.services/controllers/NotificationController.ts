import {Controller, Get, Post} from "@tsed/common";
import {NotificationService} from "../../partner-platform/services/NotificationService";
import {PushNotificationToken} from "../../partner-platform/models/PushNotificationToken";

@Controller("/notification")
export class NotificationController {

    public constructor(private readonly _notificationService: NotificationService) {

    }

    @Post("/")
    async sendNotificationToUser(request: Express.Request, response: Express.Response) {
        const notificationToken: PushNotificationToken = request['body'];
        await this._notificationService.sendNotificationToUser(notificationToken.value, "my message");
        return {};
    }

    @Post("/token")
    async RegistrationToken(request: Express.Request, response: Express.Response) {
        const notificationToken: PushNotificationToken = request['body'];
        await this._notificationService.registerToken(notificationToken);
        return {};
    }
}


