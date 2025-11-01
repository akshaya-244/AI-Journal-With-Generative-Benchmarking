-- CreateTable
CREATE TABLE "journal_entry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vectorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "journal_entry_userId_idx" ON "journal_entry"("userId");

-- CreateIndex
CREATE INDEX "journal_entry_createdAt_idx" ON "journal_entry"("createdAt");

-- AddForeignKey
ALTER TABLE "journal_entry" ADD CONSTRAINT "journal_entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
