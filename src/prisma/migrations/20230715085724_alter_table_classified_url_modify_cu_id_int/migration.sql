/*
  Warnings:

  - The primary key for the `classified_url` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `cu_id` column on the `classified_url` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "classified_url" DROP CONSTRAINT "classified_url_pkey",
DROP COLUMN "cu_id",
ADD COLUMN     "cu_id" SERIAL NOT NULL,
ADD CONSTRAINT "classified_url_pkey" PRIMARY KEY ("cu_id");
