import { type ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePayslipPDF } from "@/utils/payslipPdfGenerator";

export type PayslipRow = {
  rowType: "payslip" | "total";
  employee?: string;
  employeeId?: string | number;
  payslipId?: string | number;
  periodStart?: string;
  periodEnd?: string;
  normalHours: number;
  overtimeHours: number;
  gross: number;
  tax: number;
  super: number;
  net: number;
};

export const columns: ColumnDef<PayslipRow>[] = [
  {
    header: "Employee",
    accessorKey: "employee",
    cell: ({ row }) =>
      row.original.rowType === "total" ? (
        <span className="font-semibold">Totals</span>
      ) : (
        (row.getValue("employee") as string)
      ),
  },
  { header: "Normal Hours", accessorKey: "normalHours" },
  { header: "Overtime Hours", accessorKey: "overtimeHours" },
  {
    header: "Gross",
    accessorKey: "gross",
    cell: ({ getValue }) => (getValue<number>() ?? 0).toFixed(2),
  },
  {
    header: "Tax",
    accessorKey: "tax",
    cell: ({ getValue }) => (getValue<number>() ?? 0).toFixed(2),
  },
  {
    header: "Super",
    accessorKey: "super",
    cell: ({ getValue }) => (getValue<number>() ?? 0).toFixed(2),
  },
  {
    header: "Net",
    accessorKey: "net",
    cell: ({ getValue }) => (getValue<number>() ?? 0).toFixed(2),
  },
  {
    header: "Download",
    id: "actions",
    cell: ({ row }) => {
      if (row.original.rowType === "total") {
        return null;
      }

      const handleDownloadPDF = () => {
        const payslip = row.original;
        if (
          !payslip.payslipId ||
          !payslip.employeeId ||
          !payslip.employee ||
          !payslip.periodStart ||
          !payslip.periodEnd
        ) {
          alert("Missing payslip data. Cannot generate PDF.");
          return;
        }

        generatePayslipPDF({
          payslipId: payslip.payslipId,
          employeeId: payslip.employeeId,
          employeeName: payslip.employee,
          periodStart: payslip.periodStart,
          periodEnd: payslip.periodEnd,
          normalHours: payslip.normalHours,
          overtimeHours: payslip.overtimeHours,
          gross: payslip.gross,
          tax: payslip.tax,
          super: payslip.super,
          net: payslip.net,
        });
      };

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownloadPDF}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>
      );
    },
  },
];
