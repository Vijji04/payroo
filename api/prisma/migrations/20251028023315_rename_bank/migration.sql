/*
  Warnings:

  - You are about to drop the column `account` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `bsb` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `bank` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "account",
DROP COLUMN "bsb",
ADD COLUMN     "bank" TEXT NOT NULL;
