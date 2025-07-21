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
var JobImportWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobImportWorker = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jobs_schema_1 = require("../schemas/jobs.schema");
const importor_log_schema_1 = require("../schemas/importor-log.schema");
const common_2 = require("../../common");
let JobImportWorker = JobImportWorker_1 = class JobImportWorker {
    jobRepo;
    logRepo;
    log = new common_1.Logger(JobImportWorker_1.name);
    constructor(jobRepo, logRepo) {
        this.jobRepo = jobRepo;
        this.logRepo = logRepo;
    }
    async processImportTask(queueJob) {
        try {
            this.log.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.PROCESSING_JOB_IMPORT} ${queueJob.data.feedUrl}`);
            const { jobData, feedUrl } = queueJob.data;
            const jobDetails = {
                guid: jobData.guid?.[0]?._ ?? jobData.guid?.[0],
                title: jobData.title?.[0] ?? '',
                link: jobData.link?.[0] ?? '',
                description: jobData.description?.[0] ?? '',
            };
            let importLog = await this.logRepo.findOne({ feedUrl });
            if (!importLog) {
                this.log.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.CREATING_NEW_LOG} ${feedUrl}`);
                importLog = new this.logRepo({
                    feedUrl,
                    timestamp: new Date(),
                    totalFetched: 1,
                    newJobs: 0,
                    updatedJobs: 0,
                    failedJobs: [],
                });
            }
            else {
                this.log.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.UPDATING_EXISTING_LOG} ${feedUrl}`);
                importLog.totalFetched += 1;
                importLog.timestamp = new Date();
            }
            try {
                const foundJob = await this.jobRepo.findOne({ guid: jobDetails.guid });
                if (foundJob) {
                    this.log.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.UPDATING_EXISTING_JOB} ${jobDetails.guid}`);
                    await this.jobRepo.updateOne({ guid: jobDetails.guid }, jobDetails);
                    importLog.updatedJobs += 1;
                }
                else {
                    this.log.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.CREATING_NEW_JOB} ${jobDetails.guid}`);
                    await new this.jobRepo(jobDetails).save();
                    importLog.newJobs += 1;
                }
                this.log.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.SUCCESSFULLY_PROCESSED_JOB} ${jobDetails.title}`);
            }
            catch (jobErr) {
                this.log.error(common_2.LOG_MESSAGES.JOB_PROCESSOR.ERROR_PROCESSING_JOB
                    .replace('{guid}', jobDetails.guid)
                    .replace('{error}', jobErr.message));
                importLog.failedJobs.push({
                    reason: jobErr.message,
                    jobData: jobDetails,
                });
            }
            await importLog.save();
            this.log.log(`${common_2.LOG_MESSAGES.JOB_PROCESSOR.IMPORT_LOG_SAVED} ${feedUrl}`);
        }
        catch (err) {
            this.log.error(common_2.LOG_MESSAGES.JOB_PROCESSOR.ERROR_IN_PROCESSOR.replace('{error}', err.message));
            common_2.ErrorHandler.handleServiceError(err, 'processImportTask');
        }
    }
};
exports.JobImportWorker = JobImportWorker;
__decorate([
    (0, bull_1.Process)({ name: 'import', concurrency: Number(process.env.CONCURRENCY ?? '1') }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobImportWorker.prototype, "processImportTask", null);
exports.JobImportWorker = JobImportWorker = JobImportWorker_1 = __decorate([
    (0, bull_1.Processor)('job-import-queue'),
    __param(0, (0, mongoose_1.InjectModel)(jobs_schema_1.Job.name)),
    __param(1, (0, mongoose_1.InjectModel)(importor_log_schema_1.ImportLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], JobImportWorker);
//# sourceMappingURL=job.processor.js.map