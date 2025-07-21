export const ERROR_MESSAGES = {
  DATABASE: {
    CONNECTION_ERROR: 'Database connection error. Please try again later.',
    VALIDATION_ERROR: 'Invalid data format in database.',
    OPERATION_FAILED: 'Database operation failed',
  },
  PAGINATION: {
    INVALID_PARAMETERS: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.',
  },
  IMPORT: {
    PROCESS_FAILED: 'Failed to trigger job import process.',
    UNEXPECTED_ERROR: 'An unexpected error occurred.',
  },
  SERVICE: {
    OPERATION_FAILED: 'Service operation failed',
  },
} as const;

