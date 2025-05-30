-- AlterTable
ALTER TABLE "Poem" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "likes" INTEGER DEFAULT 0,
ADD COLUMN     "mood" TEXT;
