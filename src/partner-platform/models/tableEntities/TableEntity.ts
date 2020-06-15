export interface ITableEntity {
    key: string;
    rowId: string;
    rangeKey?: string;
    content: string;
}

export interface ITableEntityResult<T> {
    key: string;
    rowId: string;
    rangeKey?: string;
    content: T;
}
