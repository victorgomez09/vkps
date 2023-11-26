/*
  Warnings:

  - Added the required column `cpu` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memory` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateEnv" ADD COLUMN "description" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deployment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deploymentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "replicas" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "cpu" INTEGER NOT NULL,
    "templateId" TEXT NOT NULL,
    "creationDate" DATETIME NOT NULL,
    "updateTime" DATETIME NOT NULL,
    CONSTRAINT "Deployment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Deployment" ("creationDate", "deploymentId", "id", "name", "replicas", "templateId", "updateTime") SELECT "creationDate", "deploymentId", "id", "name", "replicas", "templateId", "updateTime" FROM "Deployment";
DROP TABLE "Deployment";
ALTER TABLE "new_Deployment" RENAME TO "Deployment";
CREATE UNIQUE INDEX "Deployment_deploymentId_key" ON "Deployment"("deploymentId");
CREATE UNIQUE INDEX "Deployment_name_key" ON "Deployment"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
