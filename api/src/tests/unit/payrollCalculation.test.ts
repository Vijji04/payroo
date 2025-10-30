import {
  calculateTax,
  calculateSuper,
  calculateOvertime,
} from "../../utils/payrollCalculations";

describe("Payroll calculation logic", () => {
  test("calculates tax correctly around bracket cutovers", () => {
    expect(calculateTax(350)).toBe(0);
    expect(calculateTax(800)).toBeCloseTo(80); // 10%
    expect(calculateTax(1400)).toBeCloseTo(266); // 19%
    expect(calculateTax(4000)).toBeCloseTo(1480); // 37%
  });

  test("calculates super correctly", () => {
    expect(calculateSuper(1000, 10.5)).toBeCloseTo(105);
  });

  test("calculates overtime correctly", () => {
    const result = calculateOvertime(45, 30);
    expect(result.normalHours).toBe(38);
    expect(result.overtimeHours).toBe(7);
    expect(result.gross).toBeCloseTo(38 * 30 + 7 * 30 * 1.5);
  });

  test("handles no overtime correctly", () => {
    const result = calculateOvertime(36, 25);
    expect(result.overtimeHours).toBe(0);
    expect(result.gross).toBeCloseTo(36 * 25);
  });
});
