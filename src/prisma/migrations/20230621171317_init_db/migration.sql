-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firebaseToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child" (
    "id" TEXT NOT NULL,
    "parentsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_activity" (
    "log_id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "web_title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "web_description" TEXT NOT NULL,
    "detail_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_activity_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "classified_url" (
    "cu_id" TEXT NOT NULL,
    "classified_status" TEXT NOT NULL,
    "del_status" TEXT NOT NULL,
    "description_raw" TEXT NOT NULL,
    "title_raw" TEXT NOT NULL,
    "url_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "SVM_desc_label" TEXT NOT NULL,
    "SVM_desc_desfunc" TEXT NOT NULL,
    "SVM_title_label" TEXT NOT NULL,
    "SVM_title_desfunc" TEXT NOT NULL,

    CONSTRAINT "classified_url_pkey" PRIMARY KEY ("cu_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parents_email_key" ON "parents"("email");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_childId_fkey" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child" ADD CONSTRAINT "child_parentsId_fkey" FOREIGN KEY ("parentsId") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
