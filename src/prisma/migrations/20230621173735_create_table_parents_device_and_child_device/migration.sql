-- CreateTable
CREATE TABLE "parents_device" (
    "id" TEXT NOT NULL,
    "parentsId" TEXT NOT NULL,
    "deviceToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_device" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "deviceToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parents_device" ADD CONSTRAINT "parents_device_parentsId_fkey" FOREIGN KEY ("parentsId") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_device" ADD CONSTRAINT "child_device_childId_fkey" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
