/*
  Warnings:

  - Added the required column `club_id` to the `Team` table without a default value. This is not possible if the table is not empty.

*/

-- Créer un club par défaut pour les équipes existantes
INSERT INTO "Club" (id, name, created_at, updated_at)
VALUES (gen_random_uuid(), 'Club par défaut', NOW(), NOW());

-- AlterTable - Ajouter la colonne comme nullable d'abord
ALTER TABLE "Team" ADD COLUMN "club_id" TEXT;

-- Assigner toutes les équipes existantes au club par défaut
UPDATE "Team" 
SET "club_id" = (SELECT id FROM "Club" WHERE name = 'Club par défaut' LIMIT 1)
WHERE "club_id" IS NULL;

-- Rendre la colonne NOT NULL maintenant que toutes les équipes ont un club
ALTER TABLE "Team" ALTER COLUMN "club_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
