"use client";

import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { DataSourceResponse, TableConfig } from "../types";

export interface QueryParams {
  page: number;
  pageSize: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
  filter?: string;
}

type TableQueryKey = [string, number, QueryParams];

export function useTableDataAdapter<TData>(config: TableConfig<TData>, params: QueryParams) {
  const queryKey: TableQueryKey = [config.queryKey ?? "table", config.initialPageSize, params];

  const queryFn = async ({
    queryKey,
  }: QueryFunctionContext<TableQueryKey>): Promise<DataSourceResponse<TData>> => {
    const [, , actualParams] = queryKey;
    const response = await config.dataSource(actualParams);
    return config.normalizeData
      ? config.normalizeData(response as unknown)
      : (response as DataSourceResponse<TData>);
  };

  const { data, isLoading } = useQuery<
    DataSourceResponse<TData>,
    Error,
    DataSourceResponse<TData>,
    TableQueryKey
  >({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: data?.data ?? [],
    meta: data?.meta,
    isLoading,
  };
}
