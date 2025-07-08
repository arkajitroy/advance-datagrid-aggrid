import { usersTableConfig } from "@/components/table/config/user-table";
import { TableRenderer } from "@/components/table/table-renderer";

export default function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center sm:text-left">
        Users Management
      </h1>
      <div className="overflow-x-auto">
        <TableRenderer config={usersTableConfig} />
      </div>
    </div>
  );
}
