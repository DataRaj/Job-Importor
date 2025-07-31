import axios, { AxiosError } from "axios";
import {
  GetImportLogsResponse,
  GetImportLogsQuery,
  TriggerImportResponse,
  Job,
} from "@/types/api";

// Use environment variable with fallback
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://job-importor.onrender.com/api";

// Add timeout and better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API response received from: ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error("API Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    return Promise.reject(error);
  },
);

export const getImportLogs = async (
  query?: GetImportLogsQuery,
): Promise<GetImportLogsResponse> => {
  try {
    const response = await api.get("/getImportLogsData", { params: query });
    return response.data;
  } catch (error) {
    console.error("Error fetching import logs:", error);

    // Return fallback data instead of throwing
    //@ignore-ts
    return {
      logs: [],
      total: 0,
      page: 1,
      limit: 10,
      error: "Failed to fetch import logs",
    } as unknown as GetImportLogsResponse;
  }
};

export const triggerImport = async (): Promise<TriggerImportResponse> => {
  try {
    const response = await api.post("/trigger-importf");
    return response.data;
  } catch (error) {
    console.error("Error triggering import:", error);

    // Return error response instead of throwing
    return {
      success: false,
      message: "Failed to trigger import",
      error: error instanceof Error ? error.message : "Unknown error",
    } as unknown as TriggerImportResponse;
  }
};

// Add a health check function to test API connectivity
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get("/health", { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}



export const fetchTheJobs = async (page: number, limit: number): Promise<{ jobs: Job[]; total: number }> => {
  try {
    const response = await api.get("/jobs", {
      params: { page, limit }
    });
    console.log("Fetched jobs:", response.status, response.data.data);
    return response.data && Array.isArray(response.data.data)
      ? {
          jobs: response.data.data,
          total: response.data.total,
        }
      : {
          jobs: [],
          total: 0,
        };
  } catch (error) {
    console.error("Error fetching jobs:", error);

    // Return fallback data instead of throwing
    return {
      jobs: [],
      total: 0,
    };
  }
}