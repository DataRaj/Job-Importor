import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants/error-messages';

export class DatabaseConnectionException extends HttpException {
  constructor(message?: string) {
    super(
      message || ERROR_MESSAGES.DATABASE.CONNECTION_ERROR,
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}

export class ValidationException extends HttpException {
  constructor(message?: string) {
    super(
      message || ERROR_MESSAGES.DATABASE.VALIDATION_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export class PaginationException extends HttpException {
  constructor() {
    super(
      ERROR_MESSAGES.PAGINATION.INVALID_PARAMETERS,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class UnexpectedException extends HttpException {
  constructor(message?: string) {
    super(
      message || ERROR_MESSAGES.IMPORT.UNEXPECTED_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export class ImportProcessException extends HttpException {
  constructor(message?: string) {
    super(
      message || ERROR_MESSAGES.IMPORT.PROCESS_FAILED,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
} 