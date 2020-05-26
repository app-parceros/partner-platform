import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {PushNotificationToken} from "../models/PushNotificationToken";

const firebaseAdmin = require("firebase-admin");
// const firebaseServiceAccount = require("../config/serviceAccountKey.json");

@Injectable()
@Scope('request')
export class NotificationService implements OnDestroy {

    constructor() {
        /*firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
            databaseURL: "https://app-parceros.firebaseio.com"
        });*/
    }

    public sendNotificationToUser(message: string) {
        console.log("sending message", message);
        const payload = {
            notification: {
                title: "This is a Notification",
                body: "This is the body of the notification message."
            }
        };
        const registrationToken = "<registration token goes here>";

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
    }

    $onDestroy() {
        console.log('Service destroyed');
    }


}

