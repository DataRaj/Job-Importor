import { Controller, Get, Post, Query, HttpException, Logger } from '@nestjs/common';
import { JobService } from './job.service';
import { 
  ImportLogResponseDto, 
  GetImportLogsQueryDto, 
  TriggerImportResponseDto 
} from './dto/import-log.dto';
import { ErrorHandler, LOG_MESSAGES } from '../common';

@Controller('api')
export class JobController {
  private readonly logger = new Logger(JobController.name);
  constructor(
    private jobService: JobService,
  ) {}

  @Get("getImportLogsData")
  async getImportLogsData(@Query() query: GetImportLogsQueryDto): Promise<ImportLogResponseDto> {
    try {
      this.logger.log(`${LOG_MESSAGES.JOB_CONTROLLER.FETCHING_LOGS} ${JSON.stringify(query)}`);
      const { page = 1, limit = 10 } = query;
      ErrorHandler.validatePagination(page, limit);
      const { logs, pagination } = await this.jobService.getImportLogs(query);
      this.logger.log(LOG_MESSAGES.JOB_CONTROLLER.SUCCESSFULLY_FETCHED.replace('{count}', logs.length.toString()).replace('{total}', pagination.total.toString()));

      return {
        success: true,
        data: logs,
        pagination,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      ErrorHandler.handleServiceError(error, 'getImportLogsData');
    }
  }

  @Post('trigger-importf')
  async triggerImport(): Promise<TriggerImportResponseDto> {
    try {
      this.logger.log(LOG_MESSAGES.JOB_CONTROLLER.TRIGGERING_IMPORT);
      
      await this.jobService.fetchAndQueueJobs();
      
      this.logger.log(LOG_MESSAGES.JOB_CONTROLLER.IMPORT_TRIGGERED_SUCCESS);
      
      return {
        success: true,
        message: LOG_MESSAGES.JOB_CONTROLLER.IMPORT_TRIGGERED_SUCCESS,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      ErrorHandler.handleImportError(error);
    }
  }

  @Post('remove-all-jobs')
  async removeAllJobs(): Promise<{ success: boolean; message: string }> {
    try {
      // this.logger.log(LOG_MESSAGES.JOB_CONTROLLER.REMOVING_ALL_JOBS);
      await this.jobService.removeAllJobs();
      // this.logger.log(LOG_MESSAGES.JOB_CONTROLLER.ALL_JOBS_REMOVED_SUCCESS);
      return {
        success: true,
        message: LOG_MESSAGES.JOB_CONTROLLER.ALL_JOBS_REMOVED_SUCCESS,
      };
    } catch (error) {
      ErrorHandler.handleServiceError(error, 'removeAllJobs');
    }
  }
}
