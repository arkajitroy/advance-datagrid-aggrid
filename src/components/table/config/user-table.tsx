"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/base/models/user";
import { TableConfig } from "../types";

const usersColumns: ColumnDef<User>[] = [
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
      const colorMap = {
        admin: "bg-green-100 text-green-800",
        user: "bg-blue-100 text-blue-800",
        default: "bg-gray-100 text-gray-800",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colorMap[role] || colorMap.default}`}>
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-red-100 text-red-800",
        default: "bg-yellow-100 text-yellow-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${statusMap[status] || statusMap.default}`}
        >
          {status}
        </span>
      );
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
          <DropdownMenuItem onClick={() => alert(`View ${row.original.id}`)}>View</DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Edit ${row.original.id}`)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Delete ${row.original.id}`)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const fetchUsers = async ({
  page,
  pageSize,
  sort,
  sortOrder,
  filter,
}: {
  page: number;
  pageSize: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
  filter?: string;
}) => {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(sort && { sort }),
    ...(sortOrder && { sortOrder }),
    ...(filter && { filter }),
  });

  const response = await fetch(`http://localhost:3001/users?${query}`);
  return response.json();
};

export const usersTableConfig: TableConfig<User> = {
  columns: usersColumns,
  initialPageSize: 10,
  queryKey: "users",
  dataSource: fetchUsers,
  normalizeData: (response: any) => ({
    data: response.data,
    meta: { total: response.meta.total },
  }),
};
