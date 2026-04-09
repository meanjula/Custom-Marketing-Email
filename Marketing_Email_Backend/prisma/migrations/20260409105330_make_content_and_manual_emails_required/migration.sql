/*
  Warnings:

  - Made the column `content` on table `Campaign` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "manualEmails" DROP DEFAULT;
