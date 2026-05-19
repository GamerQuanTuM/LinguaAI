-- CreateTable
CREATE TABLE "DailyLesson" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "vocabulary" JSONB NOT NULL,
    "grammar" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyLesson_userId_date_key" ON "DailyLesson"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyLesson" ADD CONSTRAINT "DailyLesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
