import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { DataTable } from "@/pages/employees/data-table";
import { columns, type PayslipRow } from "./columns";

type PayrunResponse = {
  id: string;
  periodStart: string;
  periodEnd: string;
  gross: number;
  tax: number;
  super: number;
  net: number;
  payslips: Array<{
    id: string;
    payrunId: string;
    employeeId: string;
    normalHours: number;
    overtimeHours: number;
    gross: number;
    tax: number;
    super: number;
    net: number;
    employee: {
      firstName: string;
      lastName: string;
    };
  }>;
};

export const PayrunInner = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [rows, setRows] = useState<PayslipRow[]>([]);

  const runPayrun = useMutation({
    mutationFn: async () => {
      if (!dateRange?.from || !dateRange?.to)
        throw new Error("Select a date range");
      const res = await axios.post<{ message: string; payrun: PayrunResponse }>(
        "http://localhost:8080/api/payrun",
        {
          periodStart: dateRange.from.toISOString().slice(0, 10),
          periodEnd: dateRange.to.toISOString().slice(0, 10),
        }
      );
      return res.data.payrun;
    },
    onSuccess: (payrun) => {
      const payslipRows: PayslipRow[] = payrun.payslips.map((p) => ({
        rowType: "payslip",
        employee: `${p.employee.firstName} ${p.employee.lastName}`,
        employeeId: p.employeeId,
        payslipId: p.id,
        periodStart: payrun.periodStart,
        periodEnd: payrun.periodEnd,
        normalHours: p.normalHours,
        overtimeHours: p.overtimeHours,
        gross: p.gross,
        tax: p.tax,
        super: p.super,
        net: p.net,
      }));
      const totalRow: PayslipRow = {
        rowType: "total",
        employee: "Totals",
        normalHours: payslipRows.reduce((s, r) => s + r.normalHours, 0),
        overtimeHours: payslipRows.reduce((s, r) => s + r.overtimeHours, 0),
        gross: payrun.gross,
        tax: payrun.tax,
        super: payrun.super,
        net: payrun.net,
      };
      setRows([...payslipRows, totalRow]);
    },
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="payrun-dates">Payrun period</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="payrun-dates"
                variant="outline"
                className="w-full sm:w-64 justify-between"
              >
                {dateRange?.from
                  ? `${dateRange.from.toLocaleDateString()}${
                      dateRange.to
                        ? " - " + dateRange.to.toLocaleDateString()
                        : ""
                    }`
                  : "Select date range"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                className="rounded-lg border shadow-sm"
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={() => runPayrun.mutate()}
          disabled={runPayrun.isPending}
          className="w-full sm:w-auto"
        >
          {runPayrun.isPending ? "Running..." : "Run Payrun"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
};
