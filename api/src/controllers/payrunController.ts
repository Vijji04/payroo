import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { calculatePayroll } from "../utils/payrollCalculations.js";

const prisma = new PrismaClient();

type EmployeeWithTimesheets = Prisma.EmployeeGetPayload<{
  include: {
    timesheets: {
      include: {
        entries: true;
      };
    };
  };
}>;

export const createPayRun = async (req: Request, res: Response) => {
  try {
    const { periodStart, periodEnd } = req.body;

    if (!periodStart || !periodEnd) {
      return res
        .status(400)
        .json({ error: "Both periodStart and periodEnd are required" });
    }

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    const employees = await prisma.employee.findMany({
      where: {
        timesheets: {
          some: {
            entries: {
              some: {
                date: { gte: startDate, lte: endDate },
              },
            },
          },
        },
      },
      include: {
        timesheets: {
          where: {
            entries: {
              some: { date: { gte: startDate, lte: endDate } },
            },
          },
          include: {
            entries: { where: { date: { gte: startDate, lte: endDate } } },
          },
        },
      },
    });

    if (employees.length === 0) {
      return res.json({
        message: "No employees with timesheets in this period",
      });
    }

    let totalGross = 0;
    let totalTax = 0;
    let totalSuper = 0;
    let totalNet = 0;

    const paySlipsData = employees.map((employee: EmployeeWithTimesheets) => {
      let totalHours = 0;

      // Aggregate total worked hours for the employee
      for (const ts of employee.timesheets) {
        for (const entry of ts.entries) {
          const start = new Date(
            `${entry.date.toISOString().split("T")[0]}T${entry.start}`
          );
          const end = new Date(
            `${entry.date.toISOString().split("T")[0]}T${entry.end}`
          );

          const diffMs =
            end.getTime() -
            start.getTime() -
            (Number(entry.unpaidBreakMins) || 0) * 60 * 1000;
          totalHours += diffMs / (1000 * 60 * 60);
        }
      }

      const allowances = employee.timesheets.reduce(
        (sum: number, ts) => sum + (ts.allowances || 0),
        0
      );

      const result = calculatePayroll({
        totalHours,
        baseRate: employee.baseRate,
        allowances,
        superRate: employee.superRate,
      });

      totalGross += result.gross;
      totalTax += result.taxedGross;
      totalSuper += result.superAmount;
      totalNet += result.net;

      return {
        employeeId: employee.id,
        ...result,
      };
    });

    // Save payrun + payslips
    const payrun = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newPayrun = await tx.payrun.create({
        data: {
          periodStart: startDate,
          periodEnd: endDate,
          gross: totalGross,
          tax: totalTax,
          super: totalSuper,
          net: totalNet,
        },
      });

      await tx.payslip.createMany({
        data: paySlipsData.map((p: typeof paySlipsData[0]) => ({
          payrunId: newPayrun.id,
          employeeId: p.employeeId,
          normalHours: p.normalHours,
          overtimeHours: p.overtimeHours,
          gross: p.gross,
          tax: p.taxedGross,
          super: p.superAmount,
          net: p.net,
        })),
      });

      return newPayrun;
    });

    const payrunWithPayslips = await prisma.payrun.findUnique({
      where: { id: payrun.id },
      include: {
        payslips: { include: { employee: true } },
      },
    });

    return res.status(201).json({
      message: "Payrun created successfully",
      payrun: payrunWithPayslips,
    });
  } catch (error) {
    console.error("Error generating payrun:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
