-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_deployment-volume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "deploymentId" TEXT,
    CONSTRAINT "deployment-volume_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "application" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_deployment-volume" ("deploymentId", "id", "path", "size") SELECT "deploymentId", "id", "path", "size" FROM "deployment-volume";
DROP TABLE "deployment-volume";
ALTER TABLE "new_deployment-volume" RENAME TO "deployment-volume";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
