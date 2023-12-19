/*
 Warnings:
 
 - You are about to drop the `Deployment` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `DeploymentVolume` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `DeploymentVolumeAccessMode` table. If the table is not empty, all the data it contains will be lost.
 
 */
-- DropTable
PRAGMA foreign_keys = off;
DROP TABLE "Deployment";
PRAGMA foreign_keys = on;
-- DropTable
PRAGMA foreign_keys = off;
DROP TABLE "DeploymentVolume";
PRAGMA foreign_keys = on;
-- DropTable
PRAGMA foreign_keys = off;
DROP TABLE "DeploymentVolumeAccessMode";
PRAGMA foreign_keys = on;
-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "replicas" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "cpu" INTEGER NOT NULL,
    "addonId" TEXT NOT NULL,
    "creationDate" DATETIME NOT NULL,
    "updateTime" DATETIME NOT NULL,
    CONSTRAINT "Application_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
-- CreateTable
CREATE TABLE "ApplicationVolume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL
);
-- CreateTable
CREATE TABLE "ApplicationVolumeAccessMode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessMode" TEXT NOT NULL,
    "applicationVolumeId" TEXT,
    CONSTRAINT "ApplicationVolumeAccessMode_applicationVolumeId_fkey" FOREIGN KEY ("applicationVolumeId") REFERENCES "ApplicationVolume" ("id") ON DELETE
    SET NULL ON UPDATE CASCADE
);
-- CreateIndex
CREATE UNIQUE INDEX "Application_applicationId_key" ON "Application"("applicationId");
-- CreateIndex
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");