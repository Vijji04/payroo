import Modal from "@/customComponents/popover";
import type { ColumnDef } from "@tanstack/react-table";
import type { Employee } from "../employees/columns";

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "baseRate",
    header: "Base Hourly Rate",
  },
  {
    accessorKey: "superRate",
    header: "Super Rate",
  },
  {
    accessorKey: "bank",
    header: "Bank",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const employeeId = row.original;
      return <Modal modalType="timesheet" id={employeeId.id} />;
    },
  },
];
