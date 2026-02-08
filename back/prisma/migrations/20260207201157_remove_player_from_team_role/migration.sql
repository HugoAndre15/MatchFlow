/*
  Warnings:

  - The values [PLAYER] on the enum `team_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "team_role_new" AS ENUM ('COACH', 'ASSISTANT_COACH');
ALTER TABLE "TeamUser" ALTER COLUMN "role" TYPE "team_role_new" USING ("role"::text::"team_role_new");
ALTER TYPE "team_role" RENAME TO "team_role_old";
ALTER TYPE "team_role_new" RENAME TO "team_role";
DROP TYPE "public"."team_role_old";
COMMIT;
