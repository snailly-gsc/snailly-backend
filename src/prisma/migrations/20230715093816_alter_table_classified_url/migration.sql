/*
  Warnings:

  - You are about to drop the column `FINAL_desfunc` on the `classified_url` table. All the data in the column will be lost.
  - You are about to drop the column `SVM_desc_desfunc` on the `classified_url` table. All the data in the column will be lost.
  - You are about to drop the column `SVM_title_desfunc` on the `classified_url` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "classified_url" DROP COLUMN "FINAL_desfunc",
DROP COLUMN "SVM_desc_desfunc",
DROP COLUMN "SVM_title_desfunc",
ADD COLUMN     "FINAL_decfunc" TEXT,
ADD COLUMN     "SVM_desc_decfunc" TEXT,
ADD COLUMN     "SVM_title_decfunc" DOUBLE PRECISION,
ALTER COLUMN "classified_status" DROP NOT NULL,
ALTER COLUMN "del_status" DROP NOT NULL,
ALTER COLUMN "description_raw" DROP NOT NULL,
ALTER COLUMN "title_raw" DROP NOT NULL,
ALTER COLUMN "url_type" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "SVM_desc_label" DROP NOT NULL,
ALTER COLUMN "SVM_title_label" DROP NOT NULL,
ALTER COLUMN "FINAL_label" DROP NOT NULL;
