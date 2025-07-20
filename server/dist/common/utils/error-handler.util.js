"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../exceptions/exceptions");
class ErrorHandler {
    static logger = new common_1.Logger(ErrorHandler.name);
    static handleDatabaseError(error, context) {
        this.logger.error(`Database error in ${context}: ${error.message}`, error.stack);
        if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
            throw new exceptions_1.DatabaseConnectionException();
        }
        if (error.name === 'ValidationError') {
            throw new exceptions_1.ValidationException();
        }
        throw new exceptions_1.UnexpectedException(`Database operation failed in ${context}`);
    }
    static handleServiceError(error, context) {
        this.logger.error(`Service error in ${context}: ${error.message}`, error.stack);
        if (error instanceof exceptions_1.DatabaseConnectionException ||
            error instanceof exceptions_1.ValidationException ||
            error instanceof exceptions_1.UnexpectedException) {
            throw error;
        }
        throw new exceptions_1.UnexpectedException(`Service operation failed in ${context}`);
    }
    static handleImportError(error) {
        this.logger.error(`Import process error: ${error.message}`, error.stack);
        if (error instanceof exceptions_1.DatabaseConnectionException ||
            error instanceof exceptions_1.ValidationException ||
            error instanceof exceptions_1.UnexpectedException) {
            throw error;
        }
        throw new exceptions_1.ImportProcessException(error.message);
    }
    static validatePagination(page, limit) {
        if (page < 1 || limit < 1 || limit > 100) {
            throw new exceptions_1.PaginationException();
        }
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.util.js.map