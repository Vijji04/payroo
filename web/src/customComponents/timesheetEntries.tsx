import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type DateRange } from "react-day-picker";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import axios from "axios";
import { sanitizeObject } from "@/utils/sanitizeInput";

// interface entryTypes {
//   date: string;
//   startTime: string;
//   endTime: string;
//   unpaidBreakTime: number;
// }

interface IEmployeeProps {
  employeeId: string;
  //   employeeName: string;
}

const entrySchema = z.object({
  date: z.coerce.string(),
  startTime: z.coerce.string(),
  endTime: z.coerce.string(),
  unpaidBreakTime: z.coerce
    .number()
    .min(0, "please enter a value greater than 0"),
});

const formSchema = z.object({
  entries: z.array(entrySchema),
  allowances: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

export const TimesheetEntries = ({ employeeId }: IEmployeeProps) => {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  //   const [entries, setEntries] = useState<entryTypes[]>([]);

  const numberOfDays =
    dateRange?.from && dateRange?.to
      ? Math.floor(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  const { control, register, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { entries: [] },
  });

  const { fields, replace, remove } = useFieldArray({
    control,
    name: "entries",
  });

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const newEntries = Array.from({ length: numberOfDays }).map((_, i) => {
        const date = new Date(dateRange.from!);
        date.setDate(date.getDate() + i + 1);
        return {
          date: date.toISOString().split("T")[0],
          startTime: "",
          endTime: "",
          unpaidBreakTime: 0,
        };
      });
      replace(newEntries);
    } else {
      replace([]);
    }
  }, [dateRange, numberOfDays, replace]);

  const submitTimeSheet = async (data: FormValues) => {
    const sanitizedData = sanitizeObject(data);
    const sanitizedEmployeeId = sanitizeObject(employeeId);
    const payload = {
      employeeId: sanitizedEmployeeId,
      periodStart: dateRange?.from?.toISOString().split("T")[0],
      periodEnd: dateRange?.to?.toISOString().split("T")[0],
      allowances: sanitizedData.allowances,
      entries: sanitizedData.entries.map((e) => ({
        date: e.date,
        start: e.startTime,
        end: e.endTime,
        unpaidBreakMins: e.unpaidBreakTime,
      })),
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/timesheet",
        payload
      );
      alert("Time Sheet Submitted Successfully");
      console.log("Submitted:", response.data);
    } catch (error) {
      console.error("Error submitting timesheet:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitTimeSheet)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="date" className="px-1">
                Select date range, no of days:{numberOfDays}
              </Label>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full sm:w-52 justify-between font-normal"
                >
                  {dateRange?.from
                    ? `${dateRange.from.toLocaleDateString()}${
                        dateRange.to
                          ? " - " + dateRange.to.toLocaleDateString()
                          : ""
                      }`
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
            </div>

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
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
          <div className="flex flex-col space-y-1">
            <Label>Allowance</Label>
            <input
              className="w-full sm:w-24 border rounded px-2 py-1"
              type="number"
              {...register("allowances", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-2 sm:grid-cols-6 items-center gap-2"
              >
                <div className="text-sm text-muted-foreground col-span-2 sm:col-span-2">
                  {String(field.date)}
                </div>
                <input
                  type="time"
                  {...register(`entries.${index}.startTime`)}
                  className="border shadow-sm px-2 py-1 rounded"
                />
                <input
                  type="time"
                  className="border px-2 py-1 rounded shadow-sm"
                  {...register(`entries.${index}.endTime`)}
                />
                <input
                  type="number"
                  {...register(`entries.${index}.unpaidBreakTime`, {
                    valueAsNumber: true,
                  })}
                  className="border px-2 py-1 w-full sm:w-20 rounded shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="justify-self-start sm:justify-self-auto"
                >
                  <Trash2Icon size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Submit
        </Button>
      </div>
    </form>
  );
};
