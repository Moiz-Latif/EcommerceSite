/*
  Warnings:

  - You are about to drop the column `authType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `identifier` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_identifier_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authType",
DROP COLUMN "identifier",
ADD COLUMN     "email" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AuthType";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
