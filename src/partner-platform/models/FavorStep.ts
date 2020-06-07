//export namespace Common {
import {Guid} from "./Guid";
import {ILocation} from "./Location";

export interface IFavorStep {
    id: Guid;
    name?: string;
    description?: string;
    location: ILocation;
    attachments:string[];
}

//}
