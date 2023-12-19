/*
  Warnings:

  - Added the required column `image` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ApplicationEnv" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "applicationId" TEXT,
    CONSTRAINT "ApplicationEnv_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApplicationDeployments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "creationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApplicationDeployments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ApplicationVolume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "applicationId" TEXT,
    CONSTRAINT "ApplicationVolume_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ApplicationVolume" ("id", "path", "size") SELECT "id", "path", "size" FROM "ApplicationVolume";
DROP TABLE "ApplicationVolume";
ALTER TABLE "new_ApplicationVolume" RENAME TO "ApplicationVolume";
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "replicas" INTEGER NOT NULL,
    "memory" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "addonId" TEXT,
    "creationDate" DATETIME NOT NULL,
    "updateTime" DATETIME NOT NULL,
    CONSTRAINT "Application_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("addonId", "applicationId", "cpu", "creationDate", "description", "id", "memory", "name", "replicas", "updateTime") SELECT "addonId", "applicationId", "cpu", "creationDate", "description", "id", "memory", "name", "replicas", "updateTime" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_applicationId_key" ON "Application"("applicationId");
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
