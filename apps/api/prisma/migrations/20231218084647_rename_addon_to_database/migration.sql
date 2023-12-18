/*
  Warnings:

  - You are about to drop the `Addon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AddonEnv` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AddonType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AddonVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AddonVolume` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `addonId` on the `Application` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Addon_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Addon";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AddonEnv";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AddonType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AddonVersion";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AddonVolume";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Database" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "fancyName" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "image" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DatabaseVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "version" TEXT NOT NULL,
    "databaseId" TEXT,
    CONSTRAINT "DatabaseVersion_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DatabaseEnv" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "databaseId" TEXT,
    CONSTRAINT "DatabaseEnv_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DatabaseVolume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "databaseId" TEXT NOT NULL,
    CONSTRAINT "DatabaseVolume_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "replicas" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "cpu" INTEGER NOT NULL,
    "databaseId" TEXT,
    "creationDate" DATETIME NOT NULL,
    "updateTime" DATETIME NOT NULL,
    CONSTRAINT "Application_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicationId", "cpu", "creationDate", "description", "id", "image", "memory", "name", "replicas", "updateTime") SELECT "applicationId", "cpu", "creationDate", "description", "id", "image", "memory", "name", "replicas", "updateTime" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_applicationId_key" ON "Application"("applicationId");
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Database_name_key" ON "Database"("name");
