/*
  Warnings:

  - You are about to drop the column `confirmedAt` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryAddress` on the `PurchaseOrder` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PurchaseOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poCode" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "customerPoNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'received',
    "notes" TEXT,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PurchaseOrder_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PurchaseOrder" ("id", "notes", "poCode", "quotationId", "status", "updatedAt") SELECT "id", "notes", "poCode", "quotationId", "status", "updatedAt" FROM "PurchaseOrder";
DROP TABLE "PurchaseOrder";
ALTER TABLE "new_PurchaseOrder" RENAME TO "PurchaseOrder";
CREATE UNIQUE INDEX "PurchaseOrder_poCode_key" ON "PurchaseOrder"("poCode");
CREATE UNIQUE INDEX "PurchaseOrder_quotationId_key" ON "PurchaseOrder"("quotationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
