/*
  Warnings:

  - You are about to drop the column `lessonCompleted` on the `CourseProgress` table. All the data in the column will be lost.
  - Changed the type of `classLevel` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ClassLevel" AS ENUM ('JSS1', 'JSS2', 'JSS3');

-- AlterTable
ALTER TABLE "CourseProgress" DROP COLUMN "lessonCompleted",
ADD COLUMN     "lessonsCompleted" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "classLevel",
ADD COLUMN     "classLevel" "ClassLevel" NOT NULL;
