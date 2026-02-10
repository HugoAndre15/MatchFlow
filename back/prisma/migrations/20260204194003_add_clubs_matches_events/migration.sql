/*
  Warnings:

  - The `position` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `strong_foot` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "position" AS ENUM ('GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD');

-- CreateEnum
CREATE TYPE "strong_foot" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

-- CreateEnum
CREATE TYPE "player_status" AS ENUM ('ACTIVE', 'INJURED', 'SUSPENDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "match_location" AS ENUM ('HOME', 'AWAY');

-- CreateEnum
CREATE TYPE "match_status" AS ENUM ('UPCOMING', 'LIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "match_event_type" AS ENUM ('GOAL', 'ASSIST', 'YELLOW_CARD', 'RED_CARD', 'RECOVERY', 'BALL_LOSS');

-- CreateEnum
CREATE TYPE "field_zone" AS ENUM ('LEFT', 'RIGHT', 'AXIS', 'BOX', 'OUTSIDE');

-- CreateEnum
CREATE TYPE "body_part" AS ENUM ('LEFT_FOOT', 'RIGHT_FOOT', 'HEAD');

-- CreateEnum
CREATE TYPE "club_role" AS ENUM ('PRESIDENT', 'RESPONSABLE', 'COACH');

-- CreateEnum
CREATE TYPE "team_role" AS ENUM ('COACH', 'ASSISTANT_COACH', 'PLAYER');

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "position",
ADD COLUMN     "position" "position",
DROP COLUMN "status",
ADD COLUMN     "status" "player_status" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "strong_foot",
ADD COLUMN     "strong_foot" "strong_foot";

-- DropEnum
DROP TYPE "PlayerStatus";

-- DropEnum
DROP TYPE "Position";

-- DropEnum
DROP TYPE "StrongFoot";

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "opponent" TEXT NOT NULL,
    "location" "match_location" NOT NULL,
    "match_date" TIMESTAMP(3) NOT NULL,
    "status" "match_status" NOT NULL DEFAULT 'UPCOMING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchEvent" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "event_type" "match_event_type" NOT NULL,
    "minute" INTEGER NOT NULL,
    "zone" "field_zone" NOT NULL,
    "body_part" "body_part" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubUser" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "club_role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamUser" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "team_role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubUser_club_id_user_id_key" ON "ClubUser"("club_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamUser_team_id_user_id_key" ON "TeamUser"("team_id", "user_id");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubUser" ADD CONSTRAINT "ClubUser_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubUser" ADD CONSTRAINT "ClubUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
