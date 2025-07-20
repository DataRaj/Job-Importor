import { ImportLog } from '../schemas/importor-log.schema';
export declare class ImportLogResponseDto {
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
export declare class GetImportLogsQueryDto {
    page?: number;
    limit?: number;
    feedUrl?: string;
}
export declare class TriggerImportResponseDto {
    success: boolean;
    message: string;
    error?: string;
    timestamp: string;
}
