-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "emailType" INTEGER NOT NULL DEFAULT 1,
    "ccEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "manualEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);
