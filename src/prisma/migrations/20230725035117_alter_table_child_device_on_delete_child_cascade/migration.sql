-- DropForeignKey
ALTER TABLE "child_device" DROP CONSTRAINT "child_device_childId_fkey";

-- AlterTable
ALTER TABLE "log_activity" ADD COLUMN     "grant_access" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "child_device" ADD CONSTRAINT "child_device_childId_fkey" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
