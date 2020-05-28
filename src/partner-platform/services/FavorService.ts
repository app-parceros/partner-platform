import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {ResultSet} from "../models/ResultSet";
import {Favor} from "../models/Favor";

@Injectable()
@Scope('request')
export class FavorService implements OnDestroy {

    constructor() {
    }

    public getFavors(): ResultSet<Favor> {
        const result: ResultSet<Favor> = {
            pageNumber: 1,
            pageSize: 6,
            totalPages: 4,
            totalRecords: 9,
            content: [
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f00",
                    description: " Este es un favor nuevo 0",
                    name: "Nuevo martillo 0"
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f11",
                    description: " Este es un favor nuevo 1",
                    name: "Nuevo martillo 1"
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f22",
                    description: " Este es un favor nuevo 2",
                    name: "Nuevo martillo 2"
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f33",
                    description: " Este es un favor nuevo 3",
                    name: "Nuevo martillo 3"
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f44",
                    description: " Este es un favor nuevo 4",
                    name: "Nuevo martillo 4"
                },
                {
                    id: "fe4202b0-9ee4-4710-ae36-faa928953f55",
                    description: " Este es un favor nuevo 5",
                    name: "Nuevo martillo 5"
                }
            ]
        }
        return result;
    }


    $onDestroy() {
        console.log('Service destroyed');
    }


}

