import {Controller, Get} from "@tsed/common";
import {FavorService} from "../../partner-platform/services/FavorService";

@Controller("/favor")
export class NotificationController {

    public constructor(private readonly _favorService: FavorService) {
    }

    @Get("/")
    async getFavors(request: Express.Request, response: Express.Response) {

        await this._favorService.getFavors();
        return {};
    }

}


