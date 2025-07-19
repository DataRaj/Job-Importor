export const ERROR_MESSAGES = {
    DATABASE: {
        CONNECTION_ERROR: 'Failed to establish a connection to the database. Please check your network or try again later.',
        VALIDATION_ERROR: 'Invalid data format detected in the database. Please review your input.',
        OPERATION_FAILED: 'Database operation was unsuccessful. If this continues, please reach out to support.',
    },
    PAGINATION: {
        INVALID_PARAMETERS: 'Invalid pagination parameters. "Page" must be at least 1 and "limit" should be between 1 and 100.',
    },
    IMPORT: {
        PROCESS_FAILED: 'Unable to initiate the job import process. Please try again or contact support.',
        UNEXPECTED_ERROR: 'An unexpected error occurred. Please retry or get in touch with support.',
    },
    SERVICE: {
        OPERATION_FAILED: 'Service operation could not be completed. Please try again later.',
    },
} as const;