/*
  Warnings:

  - Added the required column `icon` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "fancyName" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "templateTypeId" TEXT NOT NULL,
    CONSTRAINT "Template_templateTypeId_fkey" FOREIGN KEY ("templateTypeId") REFERENCES "TemplateType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("description", "fancyName", "id", "image", "name", "templateTypeId") SELECT "description", "fancyName", "id", "image", "name", "templateTypeId" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
