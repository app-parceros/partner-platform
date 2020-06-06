import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {ResultSet} from "../models/ResultSet";
import {IFavor} from "../models/Favor";
import {FavorPersistence} from "../persistence/FavorPersistence";

@Injectable()
@Scope('request')
export class FavorService implements OnDestroy {

    constructor(private readonly _favorPersistence: FavorPersistence) {
    }

    public getFavors(): ResultSet<IFavor> {
        const result: ResultSet<IFavor> = {
            pageNumber: 1,
            pageSize: 6,
            totalPages: 4,
            totalRecords: 9,
            content: [
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f00",
                    description: " Este es un favor nuevo 0",
                    name: "Nuevo martillo 0",
                    location: null
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f11",
                    description: " Este es un favor nuevo 1",
                    name: "Nuevo martillo 1",
                    location: null
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f22",
                    description: " Este es un favor nuevo 2",
                    name: "Nuevo martillo 2",
                    location: null
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f33",
                    description: " Este es un favor nuevo 3",
                    name: "Nuevo martillo 3",
                    location: null
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f44",
                    description: " Este es un favor nuevo 4",
                    name: "Nuevo martillo 4",
                    location: null
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f55",
                    description: " Este es un favor nuevo 5",
                    name: "Nuevo martillo 5",
                    location: null
                }
            ]
        }
        return result;
    }

    public async createFavor(favor: IFavor) {
        await this._favorPersistence.savePosition(favor.location);
    }


    $onDestroy() {
        console.log('Service destroyed');
    }


}

