"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var JobController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const common_1 = require("@nestjs/common");
const job_service_1 = require("./job.service");
const import_log_dto_1 = require("./dto/import-log.dto");
const common_2 = require("../common");
let JobController = JobController_1 = class JobController {
    jobService;
    logger = new common_1.Logger(JobController_1.name);
    constructor(jobService) {
        this.jobService = jobService;
    }
    async getImportLogsData(query) {
        try {
            this.logger.log(`${common_2.LOG_MESSAGES.JOB_CONTROLLER.FETCHING_LOGS} ${JSON.stringify(query)}`);
            const { page = 1, limit = 10 } = query;
            common_2.ErrorHandler.validatePagination(page, limit);
            const { logs, pagination } = await this.jobService.getImportLogs(query);
            this.logger.log(common_2.LOG_MESSAGES.JOB_CONTROLLER.SUCCESSFULLY_FETCHED.replace('{count}', logs.length.toString()).replace('{total}', pagination.total.toString()));
            return {
                success: true,
                data: logs,
                pagination,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            common_2.ErrorHandler.handleServiceError(error, 'getImportLogsData');
        }
    }
    async triggerImport() {
        try {
            this.logger.log(common_2.LOG_MESSAGES.JOB_CONTROLLER.TRIGGERING_IMPORT);
            await this.jobService.fetchAndQueueJobs();
            this.logger.log(common_2.LOG_MESSAGES.JOB_CONTROLLER.IMPORT_TRIGGERED_SUCCESS);
            return {
                success: true,
                message: common_2.LOG_MESSAGES.JOB_CONTROLLER.IMPORT_TRIGGERED_SUCCESS,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            common_2.ErrorHandler.handleImportError(error);
        }
    }
    async removeAllJobs() {
        try {
            await this.jobService.removeAllJobs();
            return {
                success: true,
                message: common_2.LOG_MESSAGES.JOB_CONTROLLER.ALL_JOBS_REMOVED_SUCCESS,
            };
        }
        catch (error) {
            common_2.ErrorHandler.handleServiceError(error, 'removeAllJobs');
        }
    }
};
exports.JobController = JobController;
__decorate([
    (0, common_1.Get)("getImportLogsData"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_log_dto_1.GetImportLogsQueryDto]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "getImportLogsData", null);
__decorate([
    (0, common_1.Post)('trigger-importf'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobController.prototype, "triggerImport", null);
__decorate([
    (0, common_1.Post)('remove-all-jobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobController.prototype, "removeAllJobs", null);
exports.JobController = JobController = JobController_1 = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [job_service_1.JobService])
], JobController);
//# sourceMappingURL=job.controller.js.map