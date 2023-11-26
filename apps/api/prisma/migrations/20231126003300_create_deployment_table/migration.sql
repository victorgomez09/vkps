-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deploymentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "replicas" INTEGER NOT NULL,
    "templateId" TEXT NOT NULL,
    "creationDate" DATETIME NOT NULL,
    "updateTime" DATETIME NOT NULL,
    CONSTRAINT "Deployment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeploymentVolume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DeploymentVolumeAccessMode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessMode" TEXT NOT NULL,
    "deploymentVolumeId" TEXT,
    CONSTRAINT "DeploymentVolumeAccessMode_deploymentVolumeId_fkey" FOREIGN KEY ("deploymentVolumeId") REFERENCES "DeploymentVolume" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_deploymentId_key" ON "Deployment"("deploymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_name_key" ON "Deployment"("name");
