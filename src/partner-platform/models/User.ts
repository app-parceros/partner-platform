//export namespace Common {
import {Guid} from "./Guid";
import {ILocation} from "./Location";

export interface IUser {
    id: Guid;
    userName:string;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    location: ILocation;
    creationDate?: string;
}

export interface IUserAuth extends IUser{
    password: string;
}

//}
