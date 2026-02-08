-- AlterTable
ALTER TABLE "MatchEvent" ADD COLUMN     "related_event_id" TEXT,
ALTER COLUMN "zone" DROP NOT NULL,
ALTER COLUMN "body_part" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_related_event_id_fkey" FOREIGN KEY ("related_event_id") REFERENCES "MatchEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
