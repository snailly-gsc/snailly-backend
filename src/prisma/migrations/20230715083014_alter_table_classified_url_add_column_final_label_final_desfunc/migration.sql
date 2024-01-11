/*
  Warnings:

  - Added the required column `FINAL_desfunc` to the `classified_url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FINAL_label` to the `classified_url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classified_url" ADD COLUMN     "FINAL_desfunc" TEXT NOT NULL,
ADD COLUMN     "FINAL_label" TEXT NOT NULL;
