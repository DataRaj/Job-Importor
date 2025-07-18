import { IsString, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  groupId: string;

  @IsMongoId()
  sender: string;

  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  edited?: boolean;

  @IsString()
  @IsOptional()
  mediaUrl?: string;
}
