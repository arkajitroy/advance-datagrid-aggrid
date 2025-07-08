import { ColumnDef } from "@tanstack/react-table";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  status: "active" | "inactive" | "pending";
}

export interface DataSourceResponse<T> {
  data: T[];
  meta: { total: number };
}

export interface TableConfig<TData> {
  columns: ColumnDef<TData>[];
  dataSource: (params: QueryParams) => Promise<DataSourceResponse<TData>>;
  normalizeData: (response: any) => DataSourceResponse<TData>;
  initialPageSize: number;
}

export interface QueryParams {
  page: number;
  pageSize: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
  filter?: string;
}
