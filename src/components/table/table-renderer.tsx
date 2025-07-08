"use client";

import { useRef } from "react";
import { useTableDataAdapter } from "./hooks/use-table-adapter";
import { useTableController } from "./hooks/use-table-controller";
import { TableConfig } from "./types";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "../ui/input";

interface TableRendererProps<TData> {
  config: TableConfig<TData>;
}

export function TableRenderer<TData>({ config }: TableRendererProps<TData>) {
  const { sorting, setSorting, pagination, setPagination, globalFilter, setGlobalFilter } =
    useTableController({ initialPageSize: config.initialPageSize });

  const { dataQuery, meta, isLoading } = useTableDataAdapter(config, {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sort: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
    filter: globalFilter ?? "",
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: data ?? [],
    columns: config.columns,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
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
    pageCount: meta ? Math.ceil(meta.total / pagination.pageSize) : 0,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40, // Average row height
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  console.log("DEBUG: main usersTableConfig", dataQuery);

  return (
    <div className="space-y-4">
      {/* Global Filter */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table Container */}
      <div
        ref={tableContainerRef}
        className="relative max-h-[600px] overflow-auto rounded-md border"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className="flex items-center space-x-1 cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getIsSorted() && (
                          <span>
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            style={{
              height: `${totalSize}px`,
              position: "relative",
            }}
          >
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={config.columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : !data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={config.columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      height: `${virtualRow.size}px`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
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
            onClick={() =>
              setPagination({
                ...pagination,
                pageIndex: table.getPageCount() - 1,
              })
            }
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
        <span>
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
