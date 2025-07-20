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
var JobProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jobs_schema_1 = require("../schemas/jobs.schema");
const importor_log_schema_1 = require("../schemas/importor-log.schema");
const common_2 = require("../../common");
let JobProcessor = JobProcessor_1 = class JobProcessor {
    jobModel;
    logModel;
    logger = new common_1.Logger(JobProcessor_1.name);
    constructor(jobModel, logModel) {
        this.jobModel = jobModel;
        this.logModel = logModel;
    }
    async handleJobImport(job) {
        try {
            this.logger.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.PROCESSING_JOB_IMPORT} ${job.data.feedUrl}`);
            const { jobData, feedUrl } = job.data;
            const parsedJob = {
                guid: jobData.guid?.[0]?._ || jobData.guid?.[0],
                title: jobData.title?.[0] || '',
                link: jobData.link?.[0] || '',
                description: jobData.description?.[0] || '',
            };
            let log = await this.logModel.findOne({ feedUrl });
            if (!log) {
                this.logger.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.CREATING_NEW_LOG} ${feedUrl}`);
                log = new this.logModel({
                    feedUrl,
                    timestamp: new Date(),
                    totalFetched: 1,
                    newJobs: 0,
                    updatedJobs: 0,
                    failedJobs: []
                });
            }
            else {
                this.logger.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.UPDATING_EXISTING_LOG} ${feedUrl}`);
                log.totalFetched += 1;
                log.timestamp = new Date();
            }
            try {
                const existing = await this.jobModel.findOne({ guid: parsedJob.guid });
                if (existing) {
                    this.logger.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.UPDATING_EXISTING_JOB} ${parsedJob.guid}`);
                    await this.jobModel.updateOne({ guid: parsedJob.guid }, parsedJob);
                    log.updatedJobs += 1;
                }
                else {
                    this.logger.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.CREATING_NEW_JOB} ${parsedJob.guid}`);
                    await new this.jobModel(parsedJob).save();
                    log.newJobs += 1;
                }
                this.logger.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.SUCCESSFULLY_PROCESSED_JOB} ${parsedJob.title}`);
            }
            catch (jobError) {
                this.logger.error(common_2.LOG_MESSAGES.JOB_PROCESSOR.ERROR_PROCESSING_JOB.replace('{guid}', parsedJob.guid).replace('{error}', jobError.message));
                log.failedJobs.push({
                    reason: jobError.message,
                    jobData: parsedJob
                });
            }
            await log.save();
            this.logger.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.IMPORT_LOG_SAVED} ${feedUrl}`);
        }
        catch (error) {
            this.logger.error(common_2.LOG_MESSAGES.JOB_PROCESSOR.ERROR_IN_PROCESSOR.replace('{error}', error.message));
            common_2.ErrorHandler.handleServiceError(error, 'handleJobImport');
        }
    }
};
exports.JobProcessor = JobProcessor;
__decorate([
    (0, bull_1.Process)({ name: 'import', concurrency: parseInt(process.env.CONCURRENCY || '1', 10) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobProcessor.prototype, "handleJobImport", null);
exports.JobProcessor = JobProcessor = JobProcessor_1 = __decorate([
    (0, bull_1.Processor)('job-import-queue'),
    __param(0, (0, mongoose_1.InjectModel)(jobs_schema_1.Job.name)),
    __param(1, (0, mongoose_1.InjectModel)(importor_log_schema_1.ImportLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], JobProcessor);
//# sourceMappingURL=job.processor.js.map