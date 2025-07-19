export const LOG_MESSAGES = {
  JOB_SERVICE: {
    START_SCHEDULED_IMPORT: 'Starting scheduled job import process',
    FETCHING_FEED: 'Fetching jobs from feed:',
    FOUND_JOBS: 'Found {count} jobs from feed:',
    SUCCESSFULLY_QUEUED: 'Successfully queued {count} jobs from feed:',
    COMPLETED_SCHEDULED_IMPORT: 'Completed scheduled job import process',
    FETCHING_LOGS: 'Fetching import logs with query:',
    SUCCESSFULLY_FETCHED_LOGS: 'Successfully fetched {count} logs out of {total} total',
    ERROR_PROCESSING_FEED: 'Error processing feed {feed}: {error}',
    NETWORK_ERROR: 'Network error for feed {feed}: {error}',
    HTTP_ERROR: 'HTTP error {status} for feed {feed}: {error}',
    XML_PARSING_ERROR: 'XML parsing error for feed {feed}: {error}',
    ERROR_IN_GET_LOGS: 'Error in getImportLogs: {error}',
  },
  JOB_PROCESSOR: {
    PROCESSING_JOB_IMPORT: 'Processing job import for feed:',
    CREATING_NEW_LOG: 'Creating new import log for feed:',
    UPDATING_EXISTING_LOG: 'Updating existing import log for feed:',
    UPDATING_EXISTING_JOB: 'Updating existing job with GUID:',
    CREATING_NEW_JOB: 'Creating new job with GUID:',
    SUCCESSFULLY_PROCESSED_JOB: 'Successfully processed job:',
    ERROR_PROCESSING_JOB: 'Error processing job {guid}: {error}',
    IMPORT_LOG_SAVED: 'Import log saved for feed:',
    ERROR_IN_PROCESSOR: 'Error in job processor: {error}',
  },
  JOB_CONTROLLER: {
    FETCHING_LOGS: 'Fetching import logs with query:',
    SUCCESSFULLY_FETCHED: 'Successfully fetched {count} import logs out of {total} total',
    TRIGGERING_IMPORT: 'Triggering job import process',
    IMPORT_TRIGGERED_SUCCESS: 'Job import process triggered successfully',
  }
} as const; 