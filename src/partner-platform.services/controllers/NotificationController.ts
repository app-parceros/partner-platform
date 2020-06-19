import {BodyParams, Controller, PathParams, Post} from "@tsed/common";
import {NotificationService} from "../../partner-platform/services/NotificationService";
import {PushNotificationToken} from "../../partner-platform/models/PushNotificationToken";
import {UserService} from "../../partner-platform/services/UserService";
import {Guid} from "../../partner-platform/models/Guid";

@Controller("/notification")
export class NotificationController {

    public constructor(private readonly _notificationService: NotificationService,
                       private readonly _userService: UserService) {

    }

    @Post("/user/:userId")
    async sendNotificationToUser(@PathParams("userId") userId: Guid,
                                 @BodyParams() message: any) {
        const user = await this._userService.getUserById(userId);
        if (user && user.notificationToken) {
            await this._notificationService.sendNotificationToUser(
                message.notificationToken,
                message.title || "Parcer@!",
                message.content || "Esta es una prueba");
        }

        return {};
    }

    @Post("/token")
    async RegistrationToken(request: Express.Request, response: Express.Response) {
        const notificationToken: PushNotificationToken = request['body'];
        await this._notificationService.registerToken(notificationToken);
        return {};
    }
}


