import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {IFavor} from "../models/Favor";
import {GeoHashPersistence} from "../persistence/GeoHashPersistence";
import {IPosition} from "../models/Location";
import {Guid} from "../models/Guid";
import {IUser} from "../models/User";

@Injectable()
@Scope('request')
export class UserService implements OnDestroy {
    private readonly _geoHashPersistence: GeoHashPersistence;

    constructor() {
        this._geoHashPersistence = new GeoHashPersistence('User');
    }

    public async createUser(user: IUser) {
        // other register in other table
        await this._geoHashPersistence.saveRegister<IUser>(user.location.position, user);
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

