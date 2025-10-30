import { columns } from "./columns";
import { DataTable } from "../employees/data-table";
import { getEmployeeData } from "../employees/employees";
import { useQuery } from "@tanstack/react-query";

export default function TimeSheetsPage() {
  const { data } = useQuery({
    queryKey: ["employeeData"],
    queryFn: getEmployeeData,
  });
  return (
    <div className="w-full flex justify-center py-6 sm:py-10">
      <div className="w-full max-w-6xl px-4 overflow-x-auto">
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  );
}
