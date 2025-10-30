import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("POST /api/payruns", () => {
  beforeAll(async () => {
    await prisma.employee.create({
      data: {
        firstName: "Alice",
        lastName: "Doe",
        baseRate: 30,
        superRate: 10.5,
        type: "hourly",
        bank: "123-456",
        timesheets: {
          create: {
            periodStart: new Date("2025-10-01"),
            periodEnd: new Date("2025-10-15"),
            allowances: 50,
            entries: {
              create: {
                date: new Date("2025-10-05"),
                start: "09:00",
                end: "17:00",
                unpaidBreakMins: 30,
              },
            },
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("creates a payrun successfully (happy path)", async () => {
    const res = await request(app)
      .post("/api/payruns")
      .send({ periodStart: "2025-10-01", periodEnd: "2025-10-15" })
      .expect(201);

    expect(res.body.message).toBe("Payrun created successfully");
    expect(res.body.payrun).toHaveProperty("gross");
    expect(res.body.payrun.payslips.length).toBeGreaterThan(0);
  });

  test("returns error if date range missing (validation error)", async () => {
    const res = await request(app).post("/api/payruns").send({}).expect(400);

    expect(res.body.error).toBe("Both periodStart and periodEnd are required");
  });
});
