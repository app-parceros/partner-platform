import {v4 as uuid} from 'uuid';
import {TableUtil} from "../utils/TableUtil";
import {configuration} from "../config/AWSConfig";
import {DataManagerConfiguration} from "../models/DataManagerConfiguration";
import {DynamoDB} from "aws-sdk";
import {PutItemInput} from "aws-sdk/clients/dynamodb";
import {Guid} from "../models/Guid";

const AWS = require('aws-sdk');


export class ItemPersistence {
    private dynamoDB;
    private dataManagerConfiguration: DataManagerConfiguration;

    constructor(tableName) {
        this.configureService(tableName).then();
    }

    public async configureService(tableName: string) {
        console.log('-----------Configuring  ', tableName);
        AWS.config.update(configuration);
        this.dynamoDB = new AWS.DynamoDB();
        this.dataManagerConfiguration = new DataManagerConfiguration(this.dynamoDB, `${tableName}`);

        if (tableName) {
            await this.setupTable();
        }
    }

    setupTable = async () => {
        const self = this;
        const createTableInput = TableUtil.getCreateTableRequest(this.dataManagerConfiguration);
        createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5;
        const existTable = await self.getTable(self.dataManagerConfiguration.tableName);
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

    saveItem = async <T>(resource: T) => {
        const id = uuid();
        const creationDate = new Date();
        const itemInput: PutItemInput = {
            TableName: this.dataManagerConfiguration.tableName,
            Item: {
                [this.dataManagerConfiguration.keyAttributeName]: {S: id.toString()},
                [this.dataManagerConfiguration.rangeKeyAttributeName]: {S: id.toString()},
                content: {S: JSON.stringify({id, creationDate, ...resource})}
            }
        };
        return this.dynamoDB
            .putItem(itemInput)
            .promise();
    }

    public async getItemByKey<T>(key: Guid): Promise<T> {
        const result: DynamoDB.QueryOutput[] = await this.query(null, key.toString());
        if (result && result[0]?.Items[0]?.content?.S) {
            return JSON.parse(result[0].Items[0].content.S)
        }
        return null;
    }

    private async query(queryInput: DynamoDB.QueryInput | undefined, key: string): Promise<DynamoDB.QueryOutput[]> {
        const queryOutputs: DynamoDB.QueryOutput[] = [];

        const nextQuery = async (lastEvaluatedKey: DynamoDB.Key = null) => {
            const keyConditions: { [key: string]: DynamoDB.Condition } = {};

            keyConditions[this.dataManagerConfiguration.keyAttributeName] = {
                ComparisonOperator: "EQ",
                AttributeValueList: [{S: key}]
            };

            const defaults = {
                TableName: this.dataManagerConfiguration.tableName,
                KeyConditions: keyConditions,
                IndexName: this.dataManagerConfiguration.indexName,
                ConsistentRead: this.dataManagerConfiguration.consistentRead,
                ReturnConsumedCapacity: "TOTAL",
                ExclusiveStartKey: lastEvaluatedKey
            };

            const queryOutput = await this.dataManagerConfiguration.dynamoDBClient.query({...defaults, ...queryInput}).promise();
            queryOutputs.push(queryOutput);
            if (queryOutput.LastEvaluatedKey) {
                return nextQuery(queryOutput.LastEvaluatedKey);
            }
        };

        await nextQuery();
        return queryOutputs;
    }
}
