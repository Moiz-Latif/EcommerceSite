/*
  Warnings:

  - Added the required column `Price` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Specifications` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryid` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "Price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Specifications" JSONB NOT NULL,
ADD COLUMN     "categoryid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "CategoryId" TEXT NOT NULL,
    "CategoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_CategoryName_key" ON "Category"("CategoryName");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "Category"("CategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
