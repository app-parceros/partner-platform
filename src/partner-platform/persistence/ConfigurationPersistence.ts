import {registerProvider} from "@tsed/common";
import {GeoHashPersistence} from "./GeoHashPersistence";
import {ItemPersistence} from "./ItemPersistence";

export const GeoHashUserPersistence = Symbol.for("GeoHashUserPersistence");
export const UserPersistence = Symbol.for("UserPersistence");

registerProvider({
    provide: GeoHashUserPersistence,
    useValue: new GeoHashPersistence('User')
});

registerProvider({
    provide: UserPersistence,
    useValue: new ItemPersistence('User')
});

