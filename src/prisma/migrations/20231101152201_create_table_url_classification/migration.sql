-- CreateTable
CREATE TABLE "url_classification" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "url_classification_pkey" PRIMARY KEY ("id")
);
