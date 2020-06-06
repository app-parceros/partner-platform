import {Injectable, OnDestroy, Scope} from "@tsed/common";
import {v4 as uuid} from 'uuid';

const ddbGeo = require('dynamodb-geo');
const AWS = require('aws-sdk');
import {configuration} from "../config/AWSConfig";
import {IFavor} from "../models/Favor";
import {ILocation} from "../models/Location";
import {PutPointInput} from "dynamodb-geo/dist/types";

@Injectable()
@Scope('request')
export class FavorPersistence implements OnDestroy {

    private dynamoDB;
    private geoDataManagerConfiguration;
    private geoTableManager;

    constructor() {
        console.log('FavorPersistence');
        this.configureService();

    }

    private async configureService() {
        AWS.config.update(configuration);
        this.dynamoDB = new AWS.DynamoDB();
        this.geoDataManagerConfiguration = new ddbGeo.GeoDataManagerConfiguration(this.dynamoDB, 'Favor')
        this.geoDataManagerConfiguration.hashKeyLength = 5
        this.geoTableManager = new ddbGeo.GeoDataManager(this.geoDataManagerConfiguration);
        await this.setupTable();
    }

    setupTable = async () => {
        const self = this;
        const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(this.geoDataManagerConfiguration);
        createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5;
        // console.dir(createTableInput, {depth: null});
        const existTable = await self.getTable(self.geoDataManagerConfiguration.tableName);
        if (!existTable) {
            await this.dynamoDB
                .createTable(createTableInput)
                .promise();
        }
    }

    getTable(tableName) {
        const self = this;
        const params = {TableName: tableName};
        return new Promise((resolve, reject) => {
            self.dynamoDB.describeTable(params, function (err, data) {
                if (err) {
                    resolve(null);
                } else {
                    resolve(data);
                }
            });
        });
    }

    savePosition = async (location: ILocation) => {
        const self = this;
        const pointInput: PutPointInput = {
            RangeKeyValue: {S: uuid()},
            GeoPoint: {
                latitude: location.position.lat,
                longitude: location.position.lng
            },
            PutItemInput: {
                Item: {
                    name: {S: location.name},
                    address: {S: location.address}
                }
            }
        };
        return await self.geoTableManager
            .putPoint(pointInput)
            //.batchWritePoints([pointInput])
            .promise()
    }


    $onDestroy(): Promise<any> | void {
        return undefined;
    }
}
