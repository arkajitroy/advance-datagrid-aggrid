"use client";

import { useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Table as ShadcnTable, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TableConfig, QueryParams } from "./types";
import { CustomTableBody } from "./table-body";
import { useTableController } from "./hooks/use-table-controller";
import { useTableDataAdapter } from "./hooks/use-table-adapter";
import { CustomTableHeader } from "./table-header";
import { CustomTablePagination } from "./table-pagination";

interface TableRendererProps<TData> {
  config: TableConfig<TData>;
}

export function TableRenderer<TData>({ config }: TableRendererProps<TData>) {
  const { sorting, setSorting, pagination, setPagination, globalFilter, setGlobalFilter } =
    useTableController({ initialPageSize: config.initialPageSize });

  const queryParams: QueryParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sort: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
    filter: globalFilter || undefined,
  };

  const { data, meta, isLoading, error } = useTableDataAdapter(config, queryParams);

  console.log("debug-tableRenderer", { data, meta, isLoading, error });

  const table = useReactTable({
    data,
    columns: config.columns,
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: meta.total ? Math.ceil(meta.total / pagination.pageSize) : 0,
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search all columns..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />
      <div
        ref={tableContainerRef}
        className="relative max-h-[600px] overflow-auto rounded-md border"
      >
        <ShadcnTable>
          <TableHeader>
            <CustomTableHeader headerGroups={table.getHeaderGroups()} />
          </TableHeader>
          <CustomTableBody
            rows={rows}
            virtualRows={rowVirtualizer.getVirtualItems()}
            totalSize={rowVirtualizer.getTotalSize()}
            isLoading={isLoading}
            columnCount={config.columns.length}
          />
        </ShadcnTable>
      </div>
      <CustomTablePagination table={table} pagination={pagination} setPagination={setPagination} />
    </div>
  );
}
