// back/src/player/dto/player.dto.ts
import { PlayerStatus } from '@prisma/client';

export class CreatePlayerDto {
  firstName: string;
  lastName: string;
  position: string;
  number: number;
  status?: PlayerStatus;
  teamId: string;
}

export class UpdatePlayerDto {
  firstName?: string;
  lastName?: string;
  position?: string;
  number?: number;
  status?: PlayerStatus;
}