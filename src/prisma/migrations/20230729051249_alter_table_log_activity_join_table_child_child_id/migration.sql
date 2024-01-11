-- AddForeignKey
ALTER TABLE "log_activity" ADD CONSTRAINT "log_activity_childId_fkey" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
