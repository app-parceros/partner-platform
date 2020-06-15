import {registerProvider} from "@tsed/common";
import {GeoHashPersistence} from "./GeoHashPersistence";
import {ItemPersistence} from "./ItemPersistence";

export const GeoHashFavorPersistence = Symbol.for("GeoHashFavorPersistence");
export const GeoHashUserPersistence = Symbol.for("GeoHashUserPersistence");
export const UserPersistence = Symbol.for("UserPersistence");

registerProvider({
    provide: GeoHashFavorPersistence,
    useValue: new GeoHashPersistence('Favor')
});

registerProvider({
    provide: GeoHashUserPersistence,
    useValue: new GeoHashPersistence('User')
});

registerProvider({
    provide: UserPersistence,
    useValue: new ItemPersistence('User')
});

