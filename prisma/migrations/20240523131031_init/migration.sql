/*
  Warnings:

  - You are about to drop the column `email` on the `tutors` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `tutors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tutors` DROP COLUMN `email`,
    DROP COLUMN `username`;
