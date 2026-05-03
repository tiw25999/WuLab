-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteCode" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "vatRate" REAL NOT NULL DEFAULT 7,
    "vatAmount" REAL NOT NULL,
    "total" REAL NOT NULL,
    "validDays" INTEGER NOT NULL DEFAULT 30,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "acceptedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quotation_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poCode" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "deliveryAddress" TEXT,
    "notes" TEXT,
    "confirmedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PurchaseOrder_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quoteCode_key" ON "Quotation"("quoteCode");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_inquiryId_key" ON "Quotation"("inquiryId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_poCode_key" ON "PurchaseOrder"("poCode");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_quotationId_key" ON "PurchaseOrder"("quotationId");
