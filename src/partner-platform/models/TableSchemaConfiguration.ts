export interface TableSchemaConfiguration {
    consistentRead: boolean ;
    keyAttributeName: string;
    rowIdAttributeName:string;
    rangeKeyAttributeName: string;
    contentAttributeName: string;
   // dynamoDBClient: any;
    tableName: any;
    indexName: string;
    gsiIndexName:string;

   /* constructor(dynamoDBClient, tableName) {
        this.consistentRead = false;
        this.keyAttributeName = "key";
        this.rangeKeyAttributeName = "rangeKey";
        this.contentAttributeName ="content"
        this.dynamoDBClient = dynamoDBClient;
        this.tableName = tableName;
        this.indexName = "index";
    }*/
}
