import { jsPDF } from "jspdf";

export interface PayslipData {
  payslipId: string | number;
  employeeId: string | number;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  normalHours: number;
  overtimeHours: number;
  gross: number;
  tax: number;
  super: number;
  net: number;
}

export const generatePayslipPDF = (payslip: PayslipData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Company Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PAYROO", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Payslip", pageWidth / 2, 28, { align: "center" });

  // Draw header line
  doc.setLineWidth(0.5);
  doc.line(20, 32, pageWidth - 20, 32);

  // Employee Information Section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Employee Details", 20, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${payslip.employeeName}`, 20, 50);
  doc.text(`Employee ID: ${payslip.employeeId}`, 20, 57);
  doc.text(`Payslip ID: ${payslip.payslipId}`, 20, 64);

  // Pay Period Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Pay Period", 20, 78);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `From: ${new Date(payslip.periodStart).toLocaleDateString()}`,
    20,
    86
  );
  doc.text(
    `To: ${new Date(payslip.periodEnd).toLocaleDateString()}`,
    20,
    93
  );

  // Hours Worked Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Hours Worked", 20, 107);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Normal Hours: ${payslip.normalHours.toFixed(2)}`, 20, 115);
  doc.text(`Overtime Hours: ${payslip.overtimeHours.toFixed(2)}`, 20, 122);
  doc.text(
    `Total Hours: ${(payslip.normalHours + payslip.overtimeHours).toFixed(2)}`,
    20,
    129
  );

  // Payment Summary Section (Box)
  const boxY = 145;
  const boxHeight = 50;

  doc.setFillColor(240, 240, 240);
  doc.rect(20, boxY, pageWidth - 40, boxHeight, "F");
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, boxY, pageWidth - 40, boxHeight, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Payment Summary", pageWidth / 2, boxY + 10, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const leftCol = 30;
  const rightCol = pageWidth - 50;

  doc.text("Gross Pay:", leftCol, boxY + 22);
  doc.text(`$${payslip.gross.toFixed(2)}`, rightCol, boxY + 22, {
    align: "right",
  });

  doc.text("Tax:", leftCol, boxY + 30);
  doc.text(`-$${payslip.tax.toFixed(2)}`, rightCol, boxY + 30, {
    align: "right",
  });

  doc.text("Superannuation:", leftCol, boxY + 38);
  doc.text(`$${payslip.super.toFixed(2)}`, rightCol, boxY + 38, {
    align: "right",
  });

  // Net Pay (highlighted)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Net Pay:", leftCol, boxY + 46);
  doc.text(`$${payslip.net.toFixed(2)}`, rightCol, boxY + 46, {
    align: "right",
  });

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "This is a system generated payslip. No signature required.",
    pageWidth / 2,
    280,
    { align: "center" }
  );
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    285,
    { align: "center" }
  );

  // Save PDF
  const fileName = `Payslip_${payslip.employeeName.replace(/\s+/g, "_")}_${payslip.payslipId}.pdf`;
  doc.save(fileName);
};
