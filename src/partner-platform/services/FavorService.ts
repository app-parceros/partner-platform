import {Inject, Injectable, OnDestroy, Scope} from "@tsed/common";
import {IFavor} from "../models/Favor";
import {GeoHashPersistence} from "../persistence/GeoHashPersistence";
import {IPosition} from "../models/Location";
import {ResultSet} from "../models/ResultSet";
import {UserService} from "./UserService";
import {GeoHashFavorPersistence, GeoHashUserPersistence} from "../persistence/ConfigurationPersistence";
import {NotificationService} from "./NotificationService";
import {IUser} from "../models/User";
import {Guid} from "../models/Guid";

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

    public getFavorDetail(favorId: Guid) {
        return {
            id: favorId,
            creationDate: (new Date()).toString(),
            description: 'favor description',
            position: null,
            name: 'Luis',
            reward: 4000,
            steps: [
                {
                    description: 'step number one',
                    position: {lat: 4.725758098247824, lng: -74.03076787201972}
                },
                {
                    description: 'step number two',
                    position: {lat: 4.735758098247834, lng: -74.04076787201982}
                },
                {
                    description: 'step number three',
                    position: {lat: 4.745758098247844, lng: -74.05076787201992}
                }
            ]
        };
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

