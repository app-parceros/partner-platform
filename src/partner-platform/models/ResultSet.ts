// export namespace Common {
export interface ResultSet<T> {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    content: T[];
}

//}
