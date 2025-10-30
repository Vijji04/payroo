import type { ColumnDef } from "@tanstack/react-table";

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  //   status: "pending" | "processing" | "success" | "failed";
  type: string;
  baseHourlyRate: number;
  superRate: number;
  bank: string;
};

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
];
