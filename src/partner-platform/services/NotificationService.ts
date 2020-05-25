import {Controller, Get, Injectable, OnDestroy, Post, Scope, Service} from "@tsed/common";


@Injectable()
@Scope('request')
export class NotificationService implements OnDestroy {
    public sendNotificationToUser(message: string) {
    console.log("sending message", message);
    }

    $onDestroy() {
        console.log('Service destroyed');
    }
}

