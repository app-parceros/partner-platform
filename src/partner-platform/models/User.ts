//export namespace Common {
import {Guid} from "./Guid";
import {ILocation} from "./Location";
import {IFavorStep} from "./FavorStep";

export interface IUser {
    id: Guid;
    name: string;
    lastName: string;
    email: string;
    location: ILocation;
    creationDate?: string;
}

//}
