import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {PushNotificationToken} from "../models/PushNotificationToken";

const firebaseAdmin = require("firebase-admin");
import {configuration} from "../config/FirebaseConfig";

@Injectable()
@Scope('request')
export class NotificationService implements OnDestroy {

    constructor() {
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(configuration),
            databaseURL: configuration.database_url
        });
    }

    public sendNotificationToUser(registrationToken: string, title: string, message: string) {
        console.log("sending message", message);
        const payload = {
            notification: {
                title: title,
                body: message
            }
        };


        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        firebaseAdmin
            .messaging()
            .sendToDevice(registrationToken, payload, options)
            .then(function (response) {
                console.log("Successfully sent message:", response);
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
            });

    }

    async registerToken(pushNotificationToken: PushNotificationToken) {
        console.log('token', pushNotificationToken.value);
        // todo:  complete this method
    }

    $onDestroy() {
        console.log('Service destroyed');
    }


}

