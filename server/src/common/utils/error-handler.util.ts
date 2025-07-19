import { Logger } from '@nestjs/common';
import {
  DatabaseConnectionException,
  ValidationException,
  UnexpectedException,
  ImportProcessException,
  PaginationException,
} from '../exceptions/custom-exceptions';

export class ErrorHandler {
  private static readonly logger = new Logger(ErrorHandler.name);

  static handleDatabaseError(error: any, context: string): never {
    this.logger.error(`Database error in ${context}: ${error.message}`, error.stack);

    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      throw new DatabaseConnectionException();
    }

    if (error.name === 'ValidationError') {
      throw new ValidationException();
    }

    throw new UnexpectedException(`Database operation failed in ${context}`);
  }

  static handleServiceError(error: any, context: string): never {
    this.logger.error(`Service error in ${context}: ${error.message}`, error.stack);

    if (error instanceof DatabaseConnectionException || 
        error instanceof ValidationException || 
        error instanceof UnexpectedException) {
      throw error;
    }

    throw new UnexpectedException(`Service operation failed in ${context}`);
  }

  static handleImportError(error: any): never {
    this.logger.error(`Import process error: ${error.message}`, error.stack);

    if (error instanceof DatabaseConnectionException || 
        error instanceof ValidationException || 
        error instanceof UnexpectedException) {
      throw error;
    }

    throw new ImportProcessException(error.message);
  }

  static validatePagination(page: number, limit: number): void {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new PaginationException();
    }
  }
} 