import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferPresidencyDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID du nouveau président' })
    @IsUUID()
    new_president_user_id: string;
}