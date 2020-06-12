import {ITableEntity} from "./TableEntity";
import {IUserAuth} from "../User";

export interface IUserEntity extends ITableEntity {
    userName: string,
    email: string
}
