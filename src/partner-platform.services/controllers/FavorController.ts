import {Controller, Get, Post, QueryParams} from "@tsed/common";
import {FavorService} from "../../partner-platform/services/FavorService";
import {IFavor} from "../../partner-platform/models/Favor";
import {ResultSet} from "../../partner-platform/models/ResultSet";

@Controller("/favor")
export class NotificationController {

    public constructor(private readonly _favorService: FavorService) {
    }

    @Get("/")
    async getNearestFavors(
        @QueryParams("lat") lat: number = 4.7152837, //Todo: define default values
        @QueryParams("lng") lng: number = -74.0182495, //Todo: define default values
        @QueryParams("radius") radius: number = 1000): Promise<ResultSet<any>> {
        return await this._favorService.getNearestFavors(
            {
                lat: lat,
                lng: lng
            }, radius);
    }

    @Post("/")
    async createFavor(request: Express.Request, response: Express.Response) {
        const favor: IFavor = request['body'];
        const favorsResult = await this._favorService.createFavor(favor);
        return favorsResult;
    }

}


