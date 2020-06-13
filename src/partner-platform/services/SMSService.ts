import {Injectable, OnDestroy, Scope} from "@tsed/common";

const AWS = require('aws-sdk');
import {configuration as AWSConfig} from "../config/AWSConfig";

@Injectable()
@Scope('request')
export class SMSService implements OnDestroy {
    private sns;

    constructor() {
        AWS.config.update(AWSConfig);
        this.sns = new AWS.SNS();
    }

    public sendNotificationToUser(message: string, phoneNumber: string) {
        const params = {
            Message: message,
            MessageStructure: 'string',
            PhoneNumber: phoneNumber
        };

        this.sns.publish(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
        });
    }

    $onDestroy() {
        console.log('Service destroyed');
    }


}

