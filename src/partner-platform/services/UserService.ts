import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {GeoHashPersistence} from "../persistence/GeoHashPersistence";
import {IPosition} from "../models/Location";
import {Guid} from "../models/Guid";
import {IUser} from "../models/User";
import {ItemPersistence} from "../persistence/ItemPersistence";

@Injectable()
@Scope('request')
export class UserService implements OnDestroy {
    private readonly _geoHashPersistence: GeoHashPersistence;
    private readonly _userPersistence: ItemPersistence;

    constructor() {
        this._geoHashPersistence = new GeoHashPersistence('User');
        this._userPersistence = new ItemPersistence('User');
    }

    public async createUser(user: IUser) {
        await this._userPersistence.saveItem<IUser>(user);
    }

    public async getUserById(userId: Guid): Promise<IUser> {
        return await this._userPersistence.getItemByKey<IUser>(userId);
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

