import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { position, strong_foot, player_status } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ example: 'Kylian', description: 'Prénom du joueur' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Mbappé', description: 'Nom du joueur' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID de l\'équipe' })
  @IsUUID()
  @IsNotEmpty()
  team_id: string;

  @ApiPropertyOptional({ enum: ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'], example: 'FORWARD', description: 'Poste du joueur' })
  @IsOptional()
  @IsEnum(position)
  position?: position;

  @ApiPropertyOptional({ enum: ['LEFT', 'RIGHT', 'BOTH'], example: 'RIGHT', description: 'Pied fort' })
  @IsOptional()
  @IsEnum(strong_foot)
  strong_foot?: strong_foot;

  @ApiPropertyOptional({ example: 7, description: 'Numéro de maillot (1-99)', minimum: 1, maximum: 99 })
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