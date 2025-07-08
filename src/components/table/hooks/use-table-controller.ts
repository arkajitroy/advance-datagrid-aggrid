"use client";

import { useState, useCallback } from "react";
import { SortingState, PaginationState } from "@tanstack/react-table";

interface UseTableControllerProps {
  initialPageSize: number;
}

export function useTableController({ initialPageSize }: UseTableControllerProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const handleSortingChange = useCallback((updater: any) => {
    setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }, []);

  const handlePaginationChange = useCallback((updater: any) => {
    setPagination((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }, []);

  return {
    sorting,
    setSorting: handleSortingChange,
    pagination,
    setPagination: handlePaginationChange,
    globalFilter,
    setGlobalFilter,
  };
}
