import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsUUID } from 'class-validator';
import { position, strong_foot, player_status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlayerDto {
  @ApiPropertyOptional({ example: 'Kylian', description: 'Prénom du joueur' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({ example: 'Mbappé', description: 'Nom du joueur' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID de la nouvelle équipe (transfert)' })
  @IsOptional()
  @IsUUID()
  team_id?: string;

  @ApiPropertyOptional({ enum: ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'], example: 'MIDFIELDER', description: 'Poste' })
  @IsOptional()
  @IsEnum(position)
  position?: position;

  @ApiPropertyOptional({ enum: ['LEFT', 'RIGHT', 'BOTH'], example: 'LEFT', description: 'Pied fort' })
  @IsOptional()
  @IsEnum(strong_foot)
  strong_foot?: strong_foot;

  @ApiPropertyOptional({ example: 10, description: 'Numéro de maillot (1-99)', minimum: 1, maximum: 99 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  jersey_number?: number;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'INJURED', 'SUSPENDED', 'RETIRED'], example: 'ACTIVE', description: 'Statut du joueur' })
  @IsOptional()
  @IsEnum(player_status)
  status?: player_status;
}