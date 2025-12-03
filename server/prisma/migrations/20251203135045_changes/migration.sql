/*
  Warnings:

  - You are about to drop the column `videoProvider` on the `lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "videoProvider",
ADD COLUMN     "videoPublicId" TEXT;
