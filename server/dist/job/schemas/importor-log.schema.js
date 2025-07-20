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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportLogSchema = exports.ImportLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ImportLog = class ImportLog extends mongoose_2.Document {
    feedUrl;
    timestamp;
    totalFetched;
    newJobs;
    updatedJobs;
    failedJobs;
};
exports.ImportLog = ImportLog;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: String,
        trim: true,
        maxlength: 500
    }),
    __metadata("design:type", String)
], ImportLog.prototype, "feedUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: Date,
        default: Date.now,
        index: true
    }),
    __metadata("design:type", Date)
], ImportLog.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0
    }),
    __metadata("design:type", Number)
], ImportLog.prototype, "totalFetched", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0
    }),
    __metadata("design:type", Number)
], ImportLog.prototype, "newJobs", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0
    }),
    __metadata("design:type", Number)
], ImportLog.prototype, "updatedJobs", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Array,
        default: [],
        validate: {
            validator: function (failedJobs) {
                return Array.isArray(failedJobs);
            },
            message: 'Failed jobs must be an array'
        }
    }),
    __metadata("design:type", Array)
], ImportLog.prototype, "failedJobs", void 0);
exports.ImportLog = ImportLog = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'import_logs'
    })
], ImportLog);
exports.ImportLogSchema = mongoose_1.SchemaFactory.createForClass(ImportLog);
//# sourceMappingURL=importor-log.schema.js.map