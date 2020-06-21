import {BodyParams, Controller, Get, PathParams, Post, QueryParams} from "@tsed/common";
import {FavorService} from "../../partner-platform/services/FavorService";
import {IFavor} from "../../partner-platform/models/Favor";
import {ResultSet} from "../../partner-platform/models/ResultSet";
import {Description, Summary} from "@tsed/swagger";
import {Guid} from "../../partner-platform/models/Guid";
import {PushNotificationToken} from "../../partner-platform/models/PushNotificationToken";

@Controller("/favor")
export class NotificationController {

    public constructor(private readonly _favorService: FavorService) {
    }

    @Get("/")
    async getNearestFavors(
        @QueryParams("lat") lat: number /*= 4.7152837*/,
        @QueryParams("lng") lng: number /*= -74.0182495*/,
        @QueryParams("radius") radius: number = 1000): Promise<ResultSet<any>> {
        return await this._favorService.getNearestFavors(
            {
                lat: lat,
                lng: lng
            }, radius);
    }

    @Post("/")
    @Summary("Create a favor")
    @Description("Create a favor associated with a position")
    async createFavor(
        @BodyParams() favor: IFavor) {
        return await this._favorService.createFavor(favor);
    }


    @Get("/:favorId")
    async getFavorDetail(@PathParams("favorId") favorId: Guid): Promise<any> {
        return await this._favorService.getFavorDetail(favorId);
    }

}


