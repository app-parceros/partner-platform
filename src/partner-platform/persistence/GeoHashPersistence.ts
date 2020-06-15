import {v4 as uuid} from 'uuid';
import {configuration} from "../config/AWSConfig";
import {IPosition} from "../models/Location";
import {DeletePointInput, PutPointInput, UpdatePointInput} from "dynamodb-geo/dist/types";
import {Guid} from "../models/Guid";

const ddbGeo = require('dynamodb-geo');
const AWS = require('aws-sdk');

export class GeoHashPersistence {

    private dynamoDB;
    private geoDataManagerConfiguration;
    private geoTableManager;

    constructor(tableName) {
        this.configureService(tableName).then();
    }

    public async configureService(tableName: string) {
        console.log('-----------Configuring  ', tableName);
        AWS.config.update(configuration);
        this.dynamoDB = new AWS.DynamoDB();
        this.geoDataManagerConfiguration = new ddbGeo.GeoDataManagerConfiguration(this.dynamoDB, `GeoHash${tableName}`)
        this.geoDataManagerConfiguration.hashKeyLength = 5
        this.geoTableManager = new ddbGeo.GeoDataManager(this.geoDataManagerConfiguration);
        if (tableName) {
            await this.setupTable();
        }
    }

    setupTable = async () => {
        const self = this;
        const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(this.geoDataManagerConfiguration);
        createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5;
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

    saveRegister = async <T>(position: IPosition, resource: T) => {
        const self = this;
        const id = uuid();
        const creationDate = new Date();
        const pointInput: PutPointInput = {
            RangeKeyValue: {S: id},
            GeoPoint: {
                latitude: position.lat,
                longitude: position.lng
            },
            PutItemInput: {
                Item: {
                    content: {
                        S: JSON.stringify({
                            id,
                            ...resource,
                            creationDate
                        })
                    }
                    // anotherColumn: {S: 'columnValue'}
                }
            }
        };
        return await self.geoTableManager
            .putPoint(pointInput)
            //.batchWritePoints([pointInput])
            .promise()
    }


    async deleteRegister<T>(id: Guid, position: IPosition) {
        const pointToDelete: DeletePointInput = {
            RangeKeyValue: {S: id.toString()},
            GeoPoint: {
                latitude: position.lat,
                longitude: position.lng
            }
        };
        return await this.geoTableManager
            .deletePoint(pointToDelete)
            .promise()
    }


    async updateRegister<T>(id: Guid, position: IPosition, resource) {
        await this.deleteRegister(id, position);
        return await this.saveRegister(position, resource)
    }

    async updateRegisterContent<T>(id: Guid, position: IPosition, resource) {
        const modificationDate = new Date();
        const pointInput: Partial<UpdatePointInput> = {
            RangeKeyValue: {S: id.toString()},
            GeoPoint: {
                latitude: position.lat,
                longitude: position.lng
            },
            UpdateItemInput: {
                TableName: this.geoDataManagerConfiguration.tableName,
                Key: {},
                AttributeUpdates: {
                    content: {
                        Action: "PUT",
                        Value: {
                            S: JSON.stringify({
                                id,
                                ...resource,
                                modificationDate
                            })
                        }
                    }
                }
            }
        };
        return await this.geoTableManager
            .updatePoint(pointInput)
            .promise()
    }

    async getNearestRegisters<T>(position: IPosition, radius: number = 1000): Promise<T[]> {
        const result = await this.geoTableManager.queryRadius({
            RadiusInMeter: radius,
            CenterPoint: {
                latitude: position.lat,
                longitude: position.lng
            }
        });
        return result.map(r => JSON.parse(r.content.S));
    }


}
