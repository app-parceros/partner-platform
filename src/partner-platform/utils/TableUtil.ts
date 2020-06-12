import {TableSchemaConfiguration} from "../models/TableSchemaConfiguration";

export class TableUtil {

    public static getTableSchema(config: TableSchemaConfiguration) :any{
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

