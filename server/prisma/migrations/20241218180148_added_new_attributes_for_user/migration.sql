-- AlterTable
ALTER TABLE "User" ADD COLUMN     "WishListDevices" TEXT[];

-- CreateTable
CREATE TABLE "Cart" (
    "DeviceId" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("DeviceId")
);

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
