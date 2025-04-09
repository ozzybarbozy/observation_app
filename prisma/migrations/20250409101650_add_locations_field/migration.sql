/*
  Warnings:

  - You are about to drop the column `location` on the `Observation` table. All the data in the column will be lost.
  - Added the required column `locations` to the `Observation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Observation" DROP COLUMN "location",
ADD COLUMN     "locations" TEXT NOT NULL;
