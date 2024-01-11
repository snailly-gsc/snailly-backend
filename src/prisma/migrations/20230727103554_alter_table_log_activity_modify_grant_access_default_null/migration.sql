-- AlterTable
ALTER TABLE "log_activity" ALTER COLUMN "grant_access" DROP NOT NULL,
ALTER COLUMN "grant_access" DROP DEFAULT;
