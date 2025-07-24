// back/src/match/dto/match.dto.ts
import { MatchLocation, MatchPosition, MatchStatus, CardType } from '@prisma/client';

export class CreateMatchDto {
  opponent: string;
  date: Date;
  location: MatchLocation;
  teamId: string;
}

export class UpdateMatchDto {
  opponent?: string;
  date?: Date;
  location?: MatchLocation;
  status?: MatchStatus;
  ourScore?: number;
  opponentScore?: number;
}

export class MatchCompositionDto {
  matchId: string;
  starters: {
    playerId: string;
    position: MatchPosition;
  }[];
  substitutes: {
    playerId: string;
  }[];
}

export class AddGoalDto {
  matchId: string;
  playerId: string;
  minute: number;
  isOwnGoal?: boolean;
}

export class AddAssistDto {
  matchId: string;
  playerId: string;
  minute: number;
}

export class AddCardDto {
  matchId: string;
  playerId: string;
  type: CardType;
  minute: number;
  reason?: string;
}

export class AddSubstitutionDto {
  matchId: string;
  playerInId: string;
  playerOutId: string;
  minute: number;
}