import {TableUtil} from "../utils/TableUtil";
import {configuration as AWSConfig} from "../config/AWSConfig";
import {TableSchemaConfiguration} from "../models/TableSchemaConfiguration";
import {DynamoDB} from "aws-sdk";
import {PutItemInput, UpdateItemInput} from "aws-sdk/clients/dynamodb";
import {Guid} from "../models/Guid";
import {ITableEntity, ITableEntityResult} from "../models/tableEntities/TableEntity";

const AWS = require('aws-sdk');


export class ItemPersistence {
    private dynamoDB;
    private tableSchemaConfiguration: TableSchemaConfiguration = {
        consistentRead: false,
        keyAttributeName: "key",
        rowIdAttributeName: "rowId",
        rangeKeyAttributeName: "rangeKey",
        contentAttributeName: "content",
        // dynamoDBClient : dynamoDBClient;
        tableName: "NewTableDefaultName",
        indexName: "index",
        gsiIndexName: "rowIdValue"
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
        const timestamp = +new Date();
        const modificationDate = new Date();
        const keyAttributeName = this.tableSchemaConfiguration.keyAttributeName;
        const rowIdAttributeName = this.tableSchemaConfiguration.rowIdAttributeName;
        const rangeKeyAttributeName = this.tableSchemaConfiguration.rangeKeyAttributeName;
        const itemInput: PutItemInput = {
            TableName: this.tableSchemaConfiguration.tableName,
            Item: {
                [keyAttributeName]: {S: resource.key},
                [rowIdAttributeName]: {S: resource.rowId},
                [rangeKeyAttributeName]: {S: resource.rangeKey || timestamp.toString()},
                content: {S: resource.content},
                modificationDate: {S: modificationDate.toString()}
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


    updateItem = async (resource: ITableEntity) => {
        const modificationDate = new Date();
        const keyAttributeName = this.tableSchemaConfiguration.keyAttributeName;
        const rangeKeyAttributeName = this.tableSchemaConfiguration.rangeKeyAttributeName;
        const itemInput: UpdateItemInput = {
            TableName: this.tableSchemaConfiguration.tableName,
            Key: {
                [keyAttributeName]: {S: resource.key},
                [rangeKeyAttributeName]: {S: resource.rangeKey}
            },
            UpdateExpression: "set content = :c, modificationDate = :t",
            ExpressionAttributeValues: {
                ":c": {S: resource.content},
                ":t": {S: modificationDate.toString()},
            },
            ReturnValues: "UPDATED_NEW"
        };
        return this.dynamoDB
            .updateItem(itemInput)
            .promise();
    }

    public async getItemByKey<T>(key: Guid): Promise<ITableEntityResult<T>> {
        const result: DynamoDB.QueryOutput[] = await this.query(null, key.toString());
        if (result && result[0]?.Items[0]?.content?.S) {
            const key = result[0].Items[0].key.S;
            const rangeKey = result[0].Items[0].rangeKey.S;
            const rowId = result[0].Items[0].rowId.S;
            const content = JSON.parse(result[0].Items[0].content.S);

            return {
                key: key,
                rangeKey: rangeKey,
                rowId: rowId,
                content: content
            };
        }
        return null;
    }

    public async getItemByRowId<T>(rowId: string): Promise<ITableEntityResult<T>> {
        const rowIdAttributeName = this.tableSchemaConfiguration.rowIdAttributeName;
        const query: DynamoDB.QueryInput = {
            TableName: this.tableSchemaConfiguration.tableName,
            IndexName: this.tableSchemaConfiguration.gsiIndexName,
            KeyConditionExpression: `#rk = :a`,
            ExpressionAttributeNames: {
                "#rk": rowIdAttributeName
            },
            ExpressionAttributeValues: {
                ":a": {S: rowId}
            }
        }
        const result: any = await this.dynamoDB.query(query).promise();
        if (result && result.Items[0]?.content?.S) {
            const key = result.Items[0].key.S;
            const rangeKey = result.Items[0].rangeKey.S;
            const rowId = result.Items[0].rowId.S;
            const content = JSON.parse(result.Items[0].content.S);
            return {
                key: key,
                rangeKey: rangeKey,
                rowId: rowId,
                content: content
            };
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
