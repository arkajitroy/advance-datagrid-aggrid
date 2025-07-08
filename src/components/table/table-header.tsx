import { flexRender, HeaderGroup } from "@tanstack/react-table";
import { TableHead, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CustomTableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[];
}

export function CustomTableHeader<TData>({ headerGroups }: CustomTableHeaderProps<TData>) {
  return (
    <>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder ? null : (
                <div
                  className="flex items-center space-x-1 cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
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
    </>
  );
}
