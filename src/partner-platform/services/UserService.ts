import {Inject, Injectable, OnDestroy, Scope} from "@tsed/common";
import {GeoHashPersistence} from "../persistence/GeoHashPersistence";
import {IPosition} from "../models/Location";
import {Guid} from "../models/Guid";
import {IUser} from "../models/User";
import {ItemPersistence} from "../persistence/ItemPersistence";
import {ITableEntity} from "../models/tableEntities/TableEntity";
import {v4 as uuid} from 'uuid';
import {PushNotificationToken} from "../models/PushNotificationToken";
import {GeoHashUserPersistence, UserPersistence} from "../persistence/ConfigurationPersistence";

@Injectable()
@Scope('request')
export class UserService implements OnDestroy {

    constructor(@Inject(GeoHashUserPersistence) private _geoHashPersistence: GeoHashPersistence,
                @Inject(UserPersistence) private _userPersistence: ItemPersistence) {
    }

    public async createUser(user: IUser) {
        user.id = uuid();
        const userRow: ITableEntity = {
            key: user.id.toString(),
            rowId: user.email,
            content: JSON.stringify(user)
        }
        await this._userPersistence.saveItem(userRow);
    }

    public async getUserById(userId: Guid): Promise<IUser> {
        const result = await this._userPersistence.getItemByRowId<IUser>(userId.toString());
        return result?.content;
    }

    public async registerNotificationToken(userId: Guid, token: PushNotificationToken) {
        const result = await this._userPersistence.getItemByKey<IUser>(userId);
        if (!result) {
            return;
        }
        const user = result.content;
        user.notificationToken = token.value;
        await this._userPersistence.updateItem({
            key: result.key,
            rangeKey: result.rangeKey,
            rowId: userId.toString(),
            content: JSON.stringify(user)
        });
        return token;
    }

    public async updateUserPosition(userId: Guid, position: IPosition) {
        await this._geoHashPersistence.saveRegister<Partial<IUser>>(position, {
            name: 'test user'
        });
    }


    $onDestroy() {
        console.log('Service destroyed');
    }


}

