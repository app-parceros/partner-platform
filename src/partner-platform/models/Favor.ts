//export namespace Common {
import {Guid} from "./Guid";
import {IPosition} from "./Location";
import {IFavorStep} from "./FavorStep";

export interface IFavor {
    id: Guid;
    name: string;
    description: string;
    position: IPosition;
    reward: number;
    creationDate?:string;
    steps?: IFavorStep[];
}

//}
