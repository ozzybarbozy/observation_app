/*
  Warnings:

  - The values [POSITIVE,NEGATIVE] on the enum `ObservationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `Observation` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Observation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `severity` on the `Observation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ObservationCategory" AS ENUM ('HAZARD', 'INCIDENT', 'NEAR_MISS', 'IMPROVEMENT');

-- CreateEnum
CREATE TYPE "ObservationSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "ObservationType_new" AS ENUM ('SAFETY', 'QUALITY', 'ENVIRONMENT');
ALTER TABLE "Observation" ALTER COLUMN "type" TYPE "ObservationType_new" USING ("type"::text::"ObservationType_new");
ALTER TYPE "ObservationType" RENAME TO "ObservationType_old";
ALTER TYPE "ObservationType_new" RENAME TO "ObservationType";
DROP TYPE "ObservationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Observation" DROP COLUMN "status",
DROP COLUMN "category",
ADD COLUMN     "category" "ObservationCategory" NOT NULL,
DROP COLUMN "severity",
ADD COLUMN     "severity" "ObservationSeverity" NOT NULL;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "Status";
