import { ImportLog } from '../schemas/importor-log.schema';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportLogResponseDto {
  success: boolean;
  data?: ImportLog[];
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

export class GetImportLogsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  feedUrl?: string;
}

export class TriggerImportResponseDto {
  success: boolean;
  message: string;
  error?: string;
  timestamp: string;
} 