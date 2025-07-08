"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DataSourceResponse, QueryParams, TableConfig, User } from "../types";

export const usersTableConfig: TableConfig<User> = {
  columns: [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const styles: Record<string, string> = {
          admin: "bg-green-100 text-green-800",
          user: "bg-blue-100 text-blue-800",
          guest: "bg-gray-100 text-gray-800",
        };
        return <span className={`px-2 py-1 rounded-full text-xs ${styles[role]}`}>{role}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const styles: Record<string, string> = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-red-100 text-red-800",
          pending: "bg-yellow-100 text-yellow-800",
        };
        return <span className={`px-2 py-1 rounded-full text-xs ${styles[status]}`}>{status}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert(`View ${row.original.id}`)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Edit ${row.original.id}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Delete ${row.original.id}`)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ],
  dataSource: async (params: QueryParams) => {
    const query = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => ({
          ...acc,
          ...(value !== undefined && { [key]: String(value) }),
        }),
        {} as Record<string, string>
      )
    );
    console.log("debug-dataSource", { query: query.toString() });
    const response = await fetch(`http://localhost:3001/users?${query}`, { cache: "no-store" });
    if (!response.ok) {
      console.error("debug-dataSource-error", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`HTTP error ${response.status}`);
    }
    const json = await response.json();
    console.log("debug-dataSource-response", json);
    return json;
  },
  normalizeData: (response: any): DataSourceResponse<User> => {
    console.log("debug-normalizeData", response);
    return {
      data: response.data ?? [],
      meta: { total: response.meta?.total ?? 0 },
    };
  },
  initialPageSize: 10,
};
