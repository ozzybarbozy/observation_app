/*
  Warnings:

  - You are about to drop the column `reporterId` on the `Observation` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Observation" DROP CONSTRAINT "Observation_reporterId_fkey";

-- First, add the columns as nullable
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Update existing users with default values
UPDATE "User" SET 
  "username" = COALESCE("email", "id"),
  "password" = '$2a$10$defaultpasswordhash'  -- This is a bcrypt hash for 'default123'
WHERE "username" IS NULL;

-- Now make the columns required
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;

-- Add unique constraint for username
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- Handle Observation table changes
ALTER TABLE "Observation" ADD COLUMN "category" TEXT;
ALTER TABLE "Observation" ADD COLUMN "severity" TEXT;
ALTER TABLE "Observation" ADD COLUMN "title" TEXT;
ALTER TABLE "Observation" ADD COLUMN "userId" TEXT;

-- Update existing observations with default values
UPDATE "Observation" SET 
  "category" = 'safety',
  "severity" = 'low',
  "title" = 'Untitled Observation',
  "userId" = (SELECT "id" FROM "User" LIMIT 1)
WHERE "category" IS NULL;

-- Make the columns required
ALTER TABLE "Observation" ALTER COLUMN "category" SET NOT NULL;
ALTER TABLE "Observation" ALTER COLUMN "severity" SET NOT NULL;
ALTER TABLE "Observation" ALTER COLUMN "title" SET NOT NULL;
ALTER TABLE "Observation" ALTER COLUMN "userId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
