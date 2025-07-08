"use client";

import { useState, useCallback } from "react";
import { SortingState, PaginationState } from "@tanstack/react-table";

interface TableControllerProps {
  initialPageSize: number;
}

export function useTableController({ initialPageSize }: TableControllerProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const updateSorting = useCallback(
    (updater: SortingState | ((prev: SortingState) => SortingState)) => {
      setSorting(updater instanceof Function ? updater(sorting) : updater);
    },
    []
  );

  const updatePagination = useCallback(
    (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => {
      setPagination(updater instanceof Function ? updater(pagination) : updater);
    },
    []
  );

  return {
    sorting,
    setSorting: updateSorting,
    pagination,
    setPagination: updatePagination,
    globalFilter,
    setGlobalFilter,
  };
}
