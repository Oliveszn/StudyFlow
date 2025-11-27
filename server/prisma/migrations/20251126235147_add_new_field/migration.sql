/*
  Warnings:

  - You are about to drop the `_CategoryToCourse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToCourse" DROP CONSTRAINT "_CategoryToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToCourse" DROP CONSTRAINT "_CategoryToCourse_B_fkey";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CategoryToCourse";

-- CreateIndex
CREATE INDEX "courses_categoryId_idx" ON "courses"("categoryId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
