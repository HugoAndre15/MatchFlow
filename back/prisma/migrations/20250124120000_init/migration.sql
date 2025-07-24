-- back/prisma/migrations/20250124120000_init/migration.sql

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('ACTIVE', 'INJURED', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MatchLocation" AS ENUM ('HOME', 'AWAY');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MatchPosition" AS ENUM ('GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD', 'SUBSTITUTE');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('YELLOW', 'RED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "homeColors" TEXT,
    "awayColors" TEXT,
    "stadium" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "status" "PlayerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "opponent" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" "MatchLocation" NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "ourScore" INTEGER NOT NULL DEFAULT 0,
    "opponentScore" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_players" (
    "id" TEXT NOT NULL,
    "position" "MatchPosition" NOT NULL,
    "isStarter" BOOLEAN NOT NULL DEFAULT false,
    "minutesPlayed" INTEGER NOT NULL DEFAULT 0,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "match_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "isOwnGoal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assists" (
    "id" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "assists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "type" "CardType" NOT NULL,
    "minute" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "substitutions" (
    "id" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchId" TEXT NOT NULL,
    "playerInId" TEXT NOT NULL,
    "playerOutId" TEXT NOT NULL,

    CONSTRAINT "substitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "substitution_ins" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "substitution_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "substitution_outs" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "substitution_outs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "players_teamId_number_key" ON "players"("teamId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "match_players_matchId_playerId_key" ON "match_players"("matchId", "playerId");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assists" ADD CONSTRAINT "assists_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assists" ADD CONSTRAINT "assists_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitutions" ADD CONSTRAINT "substitutions_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitutions" ADD CONSTRAINT "substitutions_playerInId_fkey" FOREIGN KEY ("playerInId") REFERENCES "substitution_ins"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitutions" ADD CONSTRAINT "substitutions_playerOutId_fkey" FOREIGN KEY ("playerOutId") REFERENCES "substitution_outs"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitution_ins" ADD CONSTRAINT "substitution_ins_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitution_outs" ADD CONSTRAINT "substitution_outs_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;