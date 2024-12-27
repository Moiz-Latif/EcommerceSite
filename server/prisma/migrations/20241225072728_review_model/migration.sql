-- CreateTable
CREATE TABLE "Review" (
    "ReviewId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("ReviewId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_deviceId_key" ON "Review"("userId", "deviceId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("DeviceId") ON DELETE RESTRICT ON UPDATE CASCADE;
