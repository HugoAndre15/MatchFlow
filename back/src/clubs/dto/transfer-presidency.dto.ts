import { IsUUID } from 'class-validator';

export class TransferPresidencyDto {
    @IsUUID()
    new_president_user_id: string;
}