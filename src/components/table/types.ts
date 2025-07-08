import { ColumnDef } from "@tanstack/react-table";

export interface TableConfig<TData> {
  columns: ColumnDef<TData>[];
  dataSource: (query: {
    page: number;
    pageSize: number;
    sort?: string;
    sortOrder?: "asc" | "desc";
    filter?: string;
  }) => Promise<DataSourceResponse<TData>>;
  normalizeData?: (response: unknown) => DataSourceResponse<TData>;
  initialPageSize: number;
  queryKey?: string; // Optional key for unique cache identity
}

export interface TableRendererProps<TData> {
  config: TableConfig<TData>;
}

export interface DataSourceResponse<T> {
  data: T[];
  meta: { total: number };
}

interface QueryParams {
  page: number;
  pageSize: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
  filter?: string;
}
