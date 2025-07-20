"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportProcessException = exports.UnexpectedException = exports.PaginationException = exports.ValidationException = exports.DatabaseConnectionException = void 0;
const common_1 = require("@nestjs/common");
const error_output_1 = require("../logs/error-output");
class DatabaseConnectionException extends common_1.HttpException {
    constructor(message) {
        super(message || error_output_1.ERROR_MESSAGES.DATABASE.CONNECTION_ERROR, common_1.HttpStatus.SERVICE_UNAVAILABLE);
    }
}
exports.DatabaseConnectionException = DatabaseConnectionException;
class ValidationException extends common_1.HttpException {
    constructor(message) {
        super(message || error_output_1.ERROR_MESSAGES.DATABASE.VALIDATION_ERROR, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.ValidationException = ValidationException;
class PaginationException extends common_1.HttpException {
    constructor() {
        super(error_output_1.ERROR_MESSAGES.PAGINATION.INVALID_PARAMETERS, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.PaginationException = PaginationException;
class UnexpectedException extends common_1.HttpException {
    constructor(message) {
        super(message || error_output_1.ERROR_MESSAGES.IMPORT.UNEXPECTED_ERROR, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.UnexpectedException = UnexpectedException;
class ImportProcessException extends common_1.HttpException {
    constructor(message) {
        super(message || error_output_1.ERROR_MESSAGES.IMPORT.PROCESS_FAILED, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.ImportProcessException = ImportProcessException;
//# sourceMappingURL=exceptions.js.map