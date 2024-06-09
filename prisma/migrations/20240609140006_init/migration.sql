/*
  Warnings:

  - Added the required column `session` to the `Class_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `class_details` ADD COLUMN `session` INTEGER NOT NULL;
