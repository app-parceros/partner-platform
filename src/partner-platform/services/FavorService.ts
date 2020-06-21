import {Inject, Injectable, OnDestroy, Scope} from "@tsed/common";
import {IFavor} from "../models/Favor";
import {GeoHashPersistence} from "../persistence/GeoHashPersistence";
import {IPosition} from "../models/Location";
import {ResultSet} from "../models/ResultSet";
import {UserService} from "./UserService";
import {GeoHashFavorPersistence, GeoHashUserPersistence} from "../persistence/ConfigurationPersistence";
import {NotificationService} from "./NotificationService";
import {IUser} from "../models/User";

@Injectable()
@Scope('request')
export class FavorService implements OnDestroy {


    constructor(@Inject(GeoHashFavorPersistence) private _geoHashFavorPersistence: GeoHashPersistence,
                @Inject(GeoHashUserPersistence) private _geoHashUserPersistence: GeoHashPersistence,
                private readonly _userService: UserService,
                private readonly _notificationService: NotificationService) {

    }

    public async createFavor(favor: IFavor) {
        const registeredFavor = await this._geoHashFavorPersistence.saveRegister<IFavor>(favor.position, favor);
        await this.notifyNearestProviders(registeredFavor);
    }

    public async getNearestFavors(position: IPosition, radius: number): Promise<ResultSet<IFavor>> {
        const resultSet = {
            pageNumber: 1,
            pageSize: 6,
            totalPages: 0,
            totalRecords: 0,
            content: []
        }
        if (!position.lat || !position.lng) {
            return resultSet
        }
        resultSet.content = await this._geoHashFavorPersistence.getNearestRegisters<IFavor>(
            position,
            radius
        );
        return resultSet;
    }

    public async notifyNearestProviders(favor: IFavor, radius: number = 4000) {
        const nearest = await this._geoHashUserPersistence.getNearestRegisters<IUser>(favor.position, radius);
        for (const user of nearest) {
            if (user.notificationToken && user.notificationToken !== "") {
                await this._notificationService.sendNotificationToUser(user.notificationToken,
                    `Parcer@, hay trabajo cerca,`,
                    `${favor.description}`,
                    {
                        'favorId': favor.id.toString()
                    });
            }
        }
    }

    $onDestroy() {
        console.log('Service destroyed');
    }


}

