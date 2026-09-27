-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('UPPER_BODY', 'LOWER_BODY', 'CORE');

-- AlterTable
ALTER TABLE "Exercise"
ADD COLUMN "category" "ExerciseCategory",
ADD COLUMN "isCustom" BOOLEAN NOT NULL DEFAULT false;
