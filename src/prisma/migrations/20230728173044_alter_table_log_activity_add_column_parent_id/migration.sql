-- AlterTable
ALTER TABLE "log_activity" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "log_activity" ADD CONSTRAINT "log_activity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
