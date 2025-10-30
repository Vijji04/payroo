import { columns, type Employee } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/customComponents/popover";
import { useQuery } from "@tanstack/react-query";

export async function getEmployeeData(): Promise<Employee[]> {
  const response = await fetch(
    "https://payroo-xis8.onrender.com/api/employees"
  );
  if (!response.ok) {
    throw new Error("Error fetching Data");
  }
  return response.json();
}

export default function EmployeesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["employeeData"],
    queryFn: getEmployeeData,
  });

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-red-600">
        Error loading employees: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-6 sm:py-10 px-4">
      <div className="w-full max-w-6xl space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-xl sm:text-2xl font-semibold">Employees List</p>
          <Modal modalType="employee" />
        </div>
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={data ?? []} />
        </div>
      </div>
    </div>
  );
}
