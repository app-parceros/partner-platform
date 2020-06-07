import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {IFavor} from "../models/Favor";
import {GeoHashPersistence} from "../persistence/GeoHashPersistence";
import {IPosition} from "../models/Location";
import {ResultSet} from "../models/ResultSet";

@Injectable()
@Scope('request')
export class FavorService implements OnDestroy {
    private readonly _geoHashPersistence: GeoHashPersistence;

    constructor() {
        this._geoHashPersistence = new GeoHashPersistence('Favor');
    }

    public async createFavor(favor: IFavor) {
        await this._geoHashPersistence.saveRegister<IFavor>(favor.location.position, favor);
    }

    public async getNearestFavors(position: IPosition, radius: number): Promise<ResultSet<IFavor>> {
        const resultSet = {
            pageNumber: 1,
            pageSize: 6,
            totalPages: 4,
            totalRecords: 9,
            content: []
        }
        if (!position.lat || !position.lng) {
            return resultSet
        }
        resultSet.content = await this._geoHashPersistence.getNearestRegisters<IFavor>(
            position,
            radius
        );
        return resultSet;
    }


    $onDestroy() {
        console.log('Service destroyed');
    }


}

