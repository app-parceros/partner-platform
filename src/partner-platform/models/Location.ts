export interface IPosition {
    lat: number;
    lng: number;
}


export interface ILocation {
    position: IPosition;
    name: string;
    address: string;
}
