import axios from 'axios';
import type { CallDataResponse } from '../types/call.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  /**
   * Fetch current Milwaukee 911 call data
   */
  async fetchCalls(): Promise<CallDataResponse> {
    const response = await apiClient.get<CallDataResponse>('/api/calls');
    return response.data;
  },

  /**
   * Force refresh of call data
   */
  async refreshCalls(): Promise<CallDataResponse> {
    const response = await apiClient.post<CallDataResponse>('/api/calls/refresh');
    return response.data;
  },

  /**
   * Check API health
   */
  async healthCheck(): Promise<{ success: boolean; status: string }> {
    const response = await apiClient.get('/api/health');
    return response.data;
  },
};
