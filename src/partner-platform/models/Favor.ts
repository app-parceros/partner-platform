//export namespace Common {
import {Guid} from "./Guid";
import {ILocation} from "./Location";

export interface IFavor {
    name: string;
    id: Guid;
    description: string;
    location: ILocation;
    reward?: number;
    steps?: any[];
}

//}
