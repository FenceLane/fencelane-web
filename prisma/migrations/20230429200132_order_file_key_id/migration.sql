/*
  Warnings:

  - The primary key for the `OrderFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderFile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `OrderFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OrderFile" DROP CONSTRAINT "OrderFile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "OrderFile_pkey" PRIMARY KEY ("key");

-- CreateIndex
CREATE UNIQUE INDEX "OrderFile_key_key" ON "OrderFile"("key");
