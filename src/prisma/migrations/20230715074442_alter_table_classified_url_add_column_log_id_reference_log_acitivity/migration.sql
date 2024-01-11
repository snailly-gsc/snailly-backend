/*
  Warnings:

  - Added the required column `log_id` to the `classified_url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "child_device" ALTER COLUMN "deviceToken" DROP NOT NULL;

-- AlterTable
ALTER TABLE "classified_url" ADD COLUMN     "log_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parents_device" ALTER COLUMN "deviceToken" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "classified_url" ADD CONSTRAINT "classified_url_log_id_fkey" FOREIGN KEY ("log_id") REFERENCES "log_activity"("log_id") ON DELETE RESTRICT ON UPDATE CASCADE;
