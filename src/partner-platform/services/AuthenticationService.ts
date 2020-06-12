import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {ItemPersistence} from "../persistence/ItemPersistence";
import {IUser, IUserAuth} from "../models/User";
import {configuration as authConfig} from "../config/AuthTokenConfig";
import {IUserEntity} from "../models/tableEntities/UserEntity";
import {v4 as uuid} from 'uuid';
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

@Injectable()
@Scope('request')
export class AuthenticationService implements OnDestroy {
    private readonly _userPersistence: ItemPersistence;

    constructor() {
        this._userPersistence = new ItemPersistence('UserAuth');
    }

    async createUser(user: IUserAuth) {
        user.password = await bcrypt.hash(user.password, 10);
        user.id =  uuid();
        const userRow: IUserEntity = {
            key: user.id.toString(),
            rangeKey: user.id.toString(),
            userName: user.userName,
            email: user.email,
            content: JSON.stringify(user)
        }
        return this._userPersistence.saveItem(userRow); // Configura para que la llave sea el email o el userName
    }

    async signIn(userCredentials: IUserAuth) {
        // let user = await this._userPersistence.getItemByKey<IUser>(userCredentials.userName);

        let   user = await this._userPersistence.getItemByColumn<IUser>('userName',userCredentials.userName);

        if (!user) {
            user = await this._userPersistence.getItemByColumn('email',userCredentials.email);
        }
        if(user){
            const authResult = await bcrypt.compare(userCredentials.password, 10);
            if (authResult) {
                console.log('Authentication failed');
                return;
            }
            return jwt.sign(
                {email: user.email, userId: user.id},
                authConfig.jwtSecret,
                {expiresIn: authConfig.jwtExpire}
            );
        }
    }

    $onDestroy() {
        console.log('Service destroyed');
    }


}

