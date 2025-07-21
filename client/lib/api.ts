import axios from 'axios';
import {
  GetImportLogsResponse,
  GetImportLogsQuery,
  TriggerImportResponse,
} from '@/types/api'; 

const API_BASE_URL = 'https://job-importor.onrender.com/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getImportLogs = async (
  query?: GetImportLogsQuery,
): Promise<GetImportLogsResponse> => {
  try {
    const response = await api.get('/getImportLogsData', { params: query });
    return response.data;
  } catch (error) {
    console.error('Error fetching import logs:', error);
    throw error;
  }
};

export const triggerImport = async (): Promise<TriggerImportResponse> => {
  try {
    const response = await api.post('/trigger-importf');
    return response.data;
  } catch (error) {
    console.error('Error triggering import:', error);
    throw error;
  }
};
