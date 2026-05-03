-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descTh" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "productType" TEXT NOT NULL DEFAULT 'standard',
    "leadTimeDays" INTEGER,
    "minOrderQty" TEXT,
    "imageUrl" TEXT,
    "datasheetUrl" TEXT,
    "specs" TEXT NOT NULL,
    "useCases" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "createdAt", "datasheetUrl", "descEn", "descTh", "id", "imageUrl", "nameEn", "nameTh", "slug", "specs", "updatedAt", "useCases") SELECT "category", "createdAt", "datasheetUrl", "descEn", "descTh", "id", "imageUrl", "nameEn", "nameTh", "slug", "specs", "updatedAt", "useCases" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
