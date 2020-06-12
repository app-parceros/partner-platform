import {TableUtil} from "../utils/TableUtil";
import {configuration as AWSConfig} from "../config/AWSConfig";
import {TableSchemaConfiguration} from "../models/TableSchemaConfiguration";
import {DynamoDB} from "aws-sdk";
import {PutItemInput} from "aws-sdk/clients/dynamodb";
import {Guid} from "../models/Guid";
import {ITableEntity} from "../models/tableEntities/TableEntity";

const AWS = require('aws-sdk');


export class ItemPersistence {
    private dynamoDB;
    private tableSchemaConfiguration: TableSchemaConfiguration = {
        consistentRead: false,
        keyAttributeName: "key",
        rangeKeyAttributeName: "rangeKey",
        contentAttributeName: "content",
        // dynamoDBClient : dynamoDBClient;
        tableName: "NewTableDefaultName",
        indexName: "index"
    };

    constructor(tableName) {
        this.configureService(tableName).then();
    }

    public async configureService(tableName: string) {
        console.log('-----------Configuring  ', tableName);
        AWS.config.update(AWSConfig);
        this.dynamoDB = new AWS.DynamoDB();
        if (tableName) {
            this.tableSchemaConfiguration.tableName = `${tableName}`;
            await this.setupTable();
        }
    }

    setupTable = async () => {
        const self = this;
        const createTableInput = TableUtil.getTableSchema(this.tableSchemaConfiguration);
        createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5;
        const existTable = await self.getTable(self.tableSchemaConfiguration.tableName);
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

    saveItem = async (resource: ITableEntity) => {
        const creationDate = new Date();
        const keyAttributeName = this.tableSchemaConfiguration.keyAttributeName;
        const rangeKeyAttributeName = this.tableSchemaConfiguration.rangeKeyAttributeName;
        const itemInput: PutItemInput = {
            TableName: this.tableSchemaConfiguration.tableName,
            Item: {
                [keyAttributeName]: {S: resource.key},
                [rangeKeyAttributeName]: {S: resource.rangeKey},
                content: {S: resource.content},
                timestamp: {S: creationDate.toString()}
            }
        };
        // Additional columns as string
        const extraColumns = Object.keys(resource).filter(c => ![keyAttributeName, rangeKeyAttributeName, 'content', 'timestamp'].includes(c))
        for (let extraColumnKey of extraColumns) {
            let extraColumnValue = resource[extraColumnKey];
            itemInput.Item[extraColumnKey] = {S: extraColumnValue.toString()}
        }

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


    public async getItemByColumn<T>(columnName: string, columnValue: string): Promise<T> {
        const query: DynamoDB.QueryInput = {
            TableName: this.tableSchemaConfiguration.tableName,
            IndexName: "ByUserName",
            KeyConditionExpression: `${columnName} = :a`,
            ExpressionAttributeValues: {
                ":a": {S: columnValue}
            }
        }
        const result: DynamoDB.QueryOutput[] = await this.dynamoDB.query(query).promise();
        if (result && result[0]?.Items[0]?.content?.S) {
            return JSON.parse(result[0].Items[0].content.S)
        }
        return null;
    }

    private async query(queryInput: DynamoDB.QueryInput | undefined, keyValue: string): Promise<DynamoDB.QueryOutput[]> {
        const queryOutputs: DynamoDB.QueryOutput[] = [];

        const nextQuery = async (lastEvaluatedKey: DynamoDB.Key = null) => {
            const keyConditions: { [key: string]: DynamoDB.Condition } = {};

            keyConditions[this.tableSchemaConfiguration.keyAttributeName] = {
                ComparisonOperator: "EQ",
                AttributeValueList: [{S: keyValue}]
            };

            const defaults = {
                TableName: this.tableSchemaConfiguration.tableName,
                KeyConditions: keyConditions,
                IndexName: this.tableSchemaConfiguration.indexName,
                ConsistentRead: this.tableSchemaConfiguration.consistentRead,
                ReturnConsumedCapacity: "TOTAL",
                ExclusiveStartKey: lastEvaluatedKey
            };
            const query = {...defaults, ...queryInput};
            const queryOutput = await this.dynamoDB.query(query).promise();
            queryOutputs.push(queryOutput);
            if (queryOutput.LastEvaluatedKey) {
                return nextQuery(queryOutput.LastEvaluatedKey);
            }
        };

        await nextQuery();
        return queryOutputs;
    }
}
