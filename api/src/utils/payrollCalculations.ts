export interface PayrollCalcInput {
  totalHours: number;
  baseRate: number;
  allowances: number;
  superRate: number;
}

export interface PayrollCalcResult {
  normalHours: number;
  overtimeHours: number;
  gross: number;
  taxedGross: number;
  superAmount: number;
  net: number;
}

export function getTaxRate(gross: number): number {
  if (gross <= 370) return 0;
  if (gross <= 900) return 0.1;
  if (gross <= 1500) return 0.19;
  if (gross <= 3000) return 0.325;
  if (gross <= 5000) return 0.37;
  return 0.45;
}

// Convenience helpers used by unit tests
export function calculateTax(gross: number): number {
  return gross * getTaxRate(gross);
}

export function calculateSuper(gross: number, superRate: number): number {
  return gross * (superRate / 100);
}

export function calculateOvertime(totalHours: number, baseRate: number) {
  const normalHours = Math.min(totalHours, 38);
  const overtimeHours = Math.max(0, totalHours - 38);
  const gross = normalHours * baseRate + overtimeHours * baseRate * 1.5;
  return { normalHours, overtimeHours, gross };
}

export function calculatePayroll({
  totalHours,
  baseRate,
  allowances,
  superRate,
}: PayrollCalcInput): PayrollCalcResult {
  const normalHours = Math.min(totalHours, 38);
  const overtimeHours = Math.max(0, totalHours - 38);

  const gross =
    normalHours * baseRate + overtimeHours * baseRate * 1.5 + allowances;

  const taxedGross = calculateTax(gross);
  const superAmount = calculateSuper(gross, superRate);
  const net = gross - taxedGross + superAmount;

  return {
    normalHours,
    overtimeHours,
    gross,
    taxedGross,
    superAmount,
    net,
  };
}
