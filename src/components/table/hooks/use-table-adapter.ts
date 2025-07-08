"use client";

import { useQuery } from "@tanstack/react-query";
import { TableConfig, DataSourceResponse, QueryParams } from "../types";

export function useTableDataAdapter<TData>(config: TableConfig<TData>, params: QueryParams) {
  const queryKey = [
    "users",
    params.page,
    params.pageSize,
    params.sort,
    params.sortOrder,
    params.filter,
  ];

  const { data, isLoading, error } = useQuery<DataSourceResponse<TData>, Error>({
    queryKey,
    queryFn: async () => {
      console.log("debug-queryFn", { params });
      const response = await config.dataSource(params);
      const normalized = config.normalizeData(response);
      console.log("debug-normalizedData", normalized);
      return normalized;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  console.log("debug-adapter", { data, isLoading, error });

  return {
    data: data?.data ?? [],
    meta: data?.meta ?? { total: 0 },
    isLoading,
    error,
  };
}
