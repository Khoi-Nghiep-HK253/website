import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from '@/constants';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}

// Base API URL from environment variable or default fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Singleton Axios Instance
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor: Automatically attach Authorization JWT token
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Flatten data response and handle global HTTP errors
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return payload directly for clean caller syntax
    return response.data;
  },
  (error) => {
    let errorMessage = 'System error occurred. Please try again.';

    if (error.response) {
      const { status, data } = error.response;
      if (data && typeof data === 'object' && 'message' in data && data.message) {
        errorMessage = data.message as string;
      }

      switch (status) {
        case 401:
          localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          break;

        case 403:
          console.error('[API 403] Access Forbidden:', data);
          break;

        case 500:
          console.error('[API 500] Internal Server Error:', data);
          break;

        default:
          console.error(`[API ${status}] Error:`, data);
          break;
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to the backend server. Please check your connection.';
      console.error('[API Network Error] No response received from server:', error.request);
    } else {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);
