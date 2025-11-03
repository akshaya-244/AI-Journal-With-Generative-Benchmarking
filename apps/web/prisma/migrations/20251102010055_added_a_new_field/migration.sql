/*
  Warnings:

  - Added the required column `title` to the `journal_entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "journal_entry" ADD COLUMN     "title" TEXT NOT NULL;
