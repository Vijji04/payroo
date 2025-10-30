import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TimesheetEntryInput {
  date: string;
  start: string;
  end: string;
  unpaidBreakMins: number;
}

interface CreateTimesheetBody {
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  allowances?: number;
  entries: TimesheetEntryInput[];
}

export const createEmployeeTimeSheet = async (req: Request, res: Response) => {
  try {
    const { employeeId, periodStart, periodEnd, allowances, entries } =
      req.body;
    if (!employeeId || !periodStart || !periodEnd || !entries?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const timesheet = await prisma.timesheet.create({
      data: {
        employeeId,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        allowances,
        entries: {
          create: entries.map((e: TimesheetEntryInput) => ({
            date: new Date(e.date),
            start: e.start,
            end: e.end,
            unpaidBreakMins: e.unpaidBreakMins,
          })),
        },
      },
      include: { entries: true },
    });

    return res.status(201).json(timesheet);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create timesheet", details: error });
  }
};
