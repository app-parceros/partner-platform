import {DataManagerConfiguration} from "../models/DataManagerConfiguration";

export class TableUtil {

    public static getCreateTableRequest(config: DataManagerConfiguration) :any{
        return {
            TableName: config.tableName,
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 5
            },
            KeySchema: [
                {
                    KeyType: "HASH",
                    AttributeName: config.keyAttributeName
                },
                {
                    KeyType: "RANGE",
                    AttributeName: config.rangeKeyAttributeName
                }
            ],
            AttributeDefinitions: [
                {AttributeName: config.keyAttributeName, AttributeType: 'S'},
                {AttributeName: config.rangeKeyAttributeName, AttributeType: 'S'}
            ],
            LocalSecondaryIndexes: [
                {
                    IndexName: config.indexName,
                    KeySchema: [
                        {
                            KeyType: 'HASH',
                            AttributeName: config.keyAttributeName
                        },
                        {
                            KeyType: 'RANGE',
                            AttributeName: config.rangeKeyAttributeName
                        }
                    ],
                    Projection: {
                        ProjectionType: 'ALL'
                    }
                }
            ]
        };
    }
}

