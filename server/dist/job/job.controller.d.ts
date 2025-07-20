import { JobService } from './job.service';
import { ImportLogResponseDto, GetImportLogsQueryDto, TriggerImportResponseDto } from './dto/import-log.dto';
export declare class JobController {
    private jobService;
    private readonly logger;
    constructor(jobService: JobService);
    getImportLogsData(query: GetImportLogsQueryDto): Promise<ImportLogResponseDto>;
    triggerImport(): Promise<TriggerImportResponseDto>;
    removeAllJobs(): Promise<{
        success: boolean;
        message: string;
    }>;
}
