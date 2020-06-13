import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {ItemPersistence} from "../persistence/ItemPersistence";
import {IUser, IUserAuth} from "../models/User";
import {configuration as authConfig} from "../config/AuthTokenConfig";
import {IUserEntity} from "../models/tableEntities/UserEntity";
import {v4 as uuid} from 'uuid';
import {ITableEntity} from "../models/tableEntities/TableEntity";
import {Unauthorized} from "@tsed/exceptions";
import {SMSService} from "./SMSService";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

@Injectable()
@Scope('request')
export class AuthenticationService implements OnDestroy {
    private readonly _userPersistence: ItemPersistence;

    constructor(private readonly _smsService: SMSService) {
        this._userPersistence = new ItemPersistence('UserAuth');

    }

    async registerUserPhone(phone: string) {
        const code = AuthenticationService.getRandomString(6);
        const user: Partial<IUserAuth> = {
            id: uuid(),
            phoneNumber: phone,
            password: await bcrypt.hash(code, 10)
        };
        const userRow: ITableEntity = {
            key: user.phoneNumber.toString(),
            rangeKey: user.id.toString(),
            content: JSON.stringify(user)
        }
        this.sendCodeToPhone(code, phone.toString());
        return this._userPersistence.saveItem(userRow);
    }

    async createUser(user: IUserAuth) {
        user.password = await bcrypt.hash(user.password, 10);
        user.id = uuid();
        const userRow: IUserEntity = {
            key: user.id.toString(),
            rangeKey: user.id.toString(),
            userName: user.userName,
            email: user.email,
            content: JSON.stringify(user)
        }
        return this._userPersistence.saveItem(userRow); // Configura para que la llave sea el email o el userName
    }

    async signIn(phone: number, hashCode: string) {
        let user = await this._userPersistence.getItemByKey<IUserAuth>(phone.toString());
        if (!user) {
            console.log('Wrong code!!');
            return;
        }
        if (user) {
            const authResult = await bcrypt.compare(hashCode, user.password);
            if (!authResult) {
                console.log('Authentication failed');
                throw new Unauthorized("Unauthorized");
            }
            const token = jwt.sign(
                {phone: user.phoneNumber, userId: user.id},
                authConfig.jwtSecret,
                {expiresIn: authConfig.jwtExpire}
            );
            return {
                token: token,
                userId: user.id
            }
        }
    }


    private sendCodeToPhone(code: string, phoneNumber: string) {
        // Todo:  create service to send to SNS
        console.log('*********************************');
        console.log(`******** Code : ${code}   ********`);
        console.log('*********************************');
        //const phoneRegex = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
        //const isValid = phoneRegex.test(phoneNumber);
        //if (isValid) {
            this._smsService.sendNotificationToUser(`Tu código parceros: ${code}`, phoneNumber);
        //}
    }

    private static getRandomString(len): string {
        const source = '1234567890';
        let ans = '';
        for (let i = len; i > 0; i--) {
            ans +=
                source[Math.floor(Math.random() * source.length)];
        }
        return ans;
    }

    $onDestroy() {
        console.log('Service destroyed');
    }


}

