"use client";

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
import { useState } from "react";

export default function CalendarRange() {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Select date range
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full sm:w-52 justify-between font-normal"
          >
            {dateRange?.from
              ? `${dateRange.from.toLocaleDateString()}${
                  dateRange.to ? " - " + dateRange.to.toLocaleDateString() : ""
                }`
              : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
  );
}
