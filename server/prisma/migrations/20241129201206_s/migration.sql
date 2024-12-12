/*
  Warnings:

  - You are about to alter the column `SerialNumber` on the `Device` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "SerialNumber" SET DATA TYPE INTEGER;
