import {Controller, Get, Post} from "@tsed/common";
const  pJson = require('../../../package.json');
@Controller("/system")
export class ResourceController {

    @Get("")
    async getSystemVersion(request: Express.Request, response: Express.Response) {
        return {
            name: "Partner platform App",
            sysDate: new Date(),
            version: pJson.version
        }
    }
}

