import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export const addEmployee = async (req: Request, res: Response) => {
  const { firstName, lastName, type, baseRate, superRate, bank } = req.body;
  try {
    const newEmployee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        type,
        baseRate: parseFloat(baseRate),
        superRate: parseFloat(superRate),
        bank,
      },
    });
    res.status(201).json({
      message: "Employee created",
      data: newEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating employee", error: error });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};
