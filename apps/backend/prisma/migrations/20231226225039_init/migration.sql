-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deploymentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "replicas" INTEGER NOT NULL,
    "memory" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "exposedNetwork" BOOLEAN NOT NULL DEFAULT false,
    "port" INTEGER NOT NULL DEFAULT 8080,
    "creationDate" DATETIME NOT NULL,
    "updateTime" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "deployment-volume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "deploymentId" TEXT,
    CONSTRAINT "deployment-volume_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "application" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "deployment-volume-access-mode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessMode" TEXT NOT NULL,
    "deploymentVolumeId" TEXT,
    CONSTRAINT "deployment-volume-access-mode_deploymentVolumeId_fkey" FOREIGN KEY ("deploymentVolumeId") REFERENCES "deployment-volume" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "deployment-env" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "deploymentId" TEXT,
    CONSTRAINT "deployment-env_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "application" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "application_deploymentId_key" ON "application"("deploymentId");

-- CreateIndex
CREATE UNIQUE INDEX "application_name_key" ON "application"("name");
