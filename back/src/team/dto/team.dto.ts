// back/src/team/dto/team.dto.ts
export class CreateTeamDto {
  name: string;
  category?: string;
  homeColors?: string;
  awayColors?: string;
  stadium?: string;
}

export class UpdateTeamDto {
  name?: string;
  category?: string;
  homeColors?: string;
  awayColors?: string;
  stadium?: string;
}