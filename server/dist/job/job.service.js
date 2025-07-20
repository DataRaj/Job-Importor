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
var JobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const xml2js_1 = require("xml2js");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const importor_log_schema_1 = require("./schemas/importor-log.schema");
const common_2 = require("../common");
const FEEDS = [
    'https://jobicy.com/?feed=job_feed',
    'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
    'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
    'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
    'https://jobicy.com/?feed=job_feed&job_categories=data-science',
    'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
    'https://jobicy.com/?feed=job_feed&job_categories=business',
    'https://jobicy.com/?feed=job_feed&job_categories=management',
    'https://www.higheredjobs.com/rss/articleFeed.cfm',
];
let JobService = JobService_1 = class JobService {
    jobQueue;
    logModel;
    logger = new common_1.Logger(JobService_1.name);
    constructor(jobQueue, logModel) {
        this.jobQueue = jobQueue;
        this.logModel = logModel;
    }
    async fetchAndQueueJobs() {
        this.logger.log(common_2.LOG_MESSAGES.JOB_SERVICE.START_SCHEDULED_IMPORT);
        for (const feed of FEEDS) {
            try {
                this.logger.log(`${common_2.LOG_MESSAGES.JOB_SERVICE.FETCHING_FEED} ${feed}`);
                const response = await axios_1.default.get(feed);
                const result = await (0, xml2js_1.parseStringPromise)(response.data);
                const jobs = result.rss.channel[0].item;
                this.logger.log(common_2.LOG_MESSAGES.JOB_SERVICE.FOUND_JOBS.replace('{count}', jobs.length.toString()).replace('{feed}', feed));
                for (const job of jobs) {
                    await this.jobQueue.add('import', {
                        feedUrl: feed,
                        jobData: job,
                    }, {
                        attempts: parseInt(process.env.ATTEMPTS || '3', 10),
                        backoff: {
                            type: 'exponential',
                            delay: parseInt(process.env.BACKOFF_DELAY || '5000', 10)
                        },
                        removeOnComplete: true,
                        removeOnFail: false,
                    });
                }
                this.logger.log(common_2.LOG_MESSAGES.JOB_SERVICE.SUCCESSFULLY_QUEUED.replace('{count}', jobs.length.toString()).replace('{feed}', feed));
            }
            catch (error) {
                this.logger.error(common_2.LOG_MESSAGES.JOB_SERVICE.ERROR_PROCESSING_FEED.replace('{feed}', feed).replace('{error}', error.message));
                if (axios_1.default.isAxiosError(error)) {
                    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                        this.logger.error(common_2.LOG_MESSAGES.JOB_SERVICE.NETWORK_ERROR.replace('{feed}', feed).replace('{error}', error.message));
                    }
                    else if (error.response?.status >= 400) {
                        this.logger.error(common_2.LOG_MESSAGES.JOB_SERVICE.HTTP_ERROR.replace('{status}', error.response?.status.toString()).replace('{feed}', feed).replace('{error}', error.message));
                    }
                }
                else if (error.name === 'ValidationError') {
                    this.logger.error(common_2.LOG_MESSAGES.JOB_SERVICE.XML_PARSING_ERROR.replace('{feed}', feed).replace('{error}', error.message));
                }
                continue;
            }
        }
        this.logger.log(common_2.LOG_MESSAGES.JOB_SERVICE.COMPLETED_SCHEDULED_IMPORT);
    }
    async getImportLogs(query) {
        try {
            this.logger.log(`${common_2.LOG_MESSAGES.JOB_SERVICE.FETCHING_LOGS} ${JSON.stringify(query)}`);
            const { page = 1, limit = 10, feedUrl } = query;
            const filter = {};
            if (feedUrl) {
                filter.feedUrl = { $regex: feedUrl, $options: 'i' };
            }
            const skip = (page - 1) * limit;
            const [logs, total] = await Promise.all([
                this.logModel
                    .find(filter)
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec(),
                this.logModel.countDocuments(filter).exec()
            ]);
            const totalPages = Math.ceil(total / limit);
            this.logger.log(common_2.LOG_MESSAGES.JOB_SERVICE.SUCCESSFULLY_FETCHED_LOGS.replace('{count}', logs.length.toString()).replace('{total}', total.toString()));
            return {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                }
            };
        }
        catch (error) {
            this.logger.error(common_2.LOG_MESSAGES.JOB_SERVICE.ERROR_IN_GET_LOGS.replace('{error}', error.message));
            common_2.ErrorHandler.handleDatabaseError(error, 'getImportLogs');
        }
    }
    async removeAllJobs() {
        try {
            this.logger.log('Removing all jobs from the queue');
            const result = await this.logModel.deleteMany({});
            await this.jobQueue.drain();
            this.logger.log(`All jobs removed successfully: ${result.deletedCount} jobs deleted`);
        }
        catch (error) {
            this.logger.error(`Error removing jobs: ${error.message}`);
            common_2.ErrorHandler.handleServiceError(error, 'removeAllJobs');
        }
    }
};
exports.JobService = JobService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobService.prototype, "fetchAndQueueJobs", null);
exports.JobService = JobService = JobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('job-import-queue')),
    __param(1, (0, mongoose_1.InjectModel)(importor_log_schema_1.ImportLog.name)),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        mongoose_2.Model])
], JobService);
//# sourceMappingURL=job.service.js.map