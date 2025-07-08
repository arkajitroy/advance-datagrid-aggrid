"use client";

import { Table as TanStackTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface CustomTablePaginationProps<TData> {
  table: TanStackTable<TData>;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (updater: any) => void;
}

export function CustomTablePagination<TData>({
  table,
  pagination,
  setPagination,
}: CustomTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
          disabled={!table.getCanPreviousPage()}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPagination({ ...pagination, pageIndex: table.getPageCount() - 1 })}
          disabled={!table.getCanNextPage()}
        >
          Last
        </Button>
      </div>
      <span>
        Page {pagination.pageIndex + 1} of {table.getPageCount()}
      </span>
    </div>
  );
}
