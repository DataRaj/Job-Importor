"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bull_1 = require("@nestjs/bull");
const job_service_1 = require("./job.service");
const job_processor_1 = require("./job.processor/job.processor");
const importor_log_schema_1 = require("./schemas/importor-log.schema");
const jobs_schema_1 = require("./schemas/jobs.schema");
const job_controller_1 = require("./job.controller");
let JobModule = class JobModule {
};
exports.JobModule = JobModule;
exports.JobModule = JobModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({ name: 'job-import-queue' }),
            mongoose_1.MongooseModule.forFeature([
                { name: jobs_schema_1.Job.name, schema: jobs_schema_1.JobSchema },
                { name: importor_log_schema_1.ImportLog.name, schema: importor_log_schema_1.ImportLogSchema },
            ]),
        ],
        providers: [job_service_1.JobService, job_processor_1.JobImportWorker],
        controllers: [job_controller_1.JobController],
    })
], JobModule);
//# sourceMappingURL=job.module.js.map