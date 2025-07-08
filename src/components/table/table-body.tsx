"use client";

import { flexRender, Row } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { VirtualItem } from "@tanstack/react-virtual";

interface CustomTableBodyProps<TData> {
  rows: Row<TData>[];
  virtualRows: VirtualItem[];
  totalSize: number;
  isLoading: boolean;
  columnCount: number;
}

export function CustomTableBody<TData>({
  rows,
  virtualRows,
  totalSize,
  isLoading,
  columnCount,
}: CustomTableBodyProps<TData>) {
  return (
    <TableBody style={{ height: `${totalSize}px`, position: "relative" }}>
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={columnCount} className="text-center">
            Loading...
          </TableCell>
        </TableRow>
      ) : rows.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columnCount} className="text-center">
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
  );
}
