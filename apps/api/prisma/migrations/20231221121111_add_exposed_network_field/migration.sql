-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "replicas" INTEGER NOT NULL,
    "memory" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "exposedNetwork" BOOLEAN NOT NULL DEFAULT false,
    "addonId" TEXT,
    "creationDate" DATETIME NOT NULL,
    "updateTime" DATETIME NOT NULL,
    CONSTRAINT "Application_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("addonId", "applicationId", "cpu", "creationDate", "description", "id", "image", "memory", "name", "replicas", "updateTime") SELECT "addonId", "applicationId", "cpu", "creationDate", "description", "id", "image", "memory", "name", "replicas", "updateTime" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_applicationId_key" ON "Application"("applicationId");
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
