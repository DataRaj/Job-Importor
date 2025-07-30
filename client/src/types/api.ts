// src/types/api.ts

export interface ImportLog {
  _id: string;
  feedUrl: string;
  timestamp: string; // ISO 8601 string
  totalFetched: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: Array<{
    reason: string;
    jobData: any; // Define a more specific type if you know jobData structure well
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetImportLogsResponse {
  success: boolean;
  data: ImportLog[];
  pagination: Pagination;
  timestamp: string; // ISO 8601 string
}

export interface GetImportLogsQuery {
  page?: number;
  limit?: number;
  feedUrl?: string;
}

export interface TriggerImportResponse {
  success: boolean;
  message: string;
  timestamp: string; // ISO 8601 string
}