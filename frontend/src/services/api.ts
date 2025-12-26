import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ConversationCompletionRequest, ConversationCompletionResponse, ApiError } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private client: AxiosInstance;
  private requestStartTime: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - track start time
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.requestStartTime = Date.now();
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - calculate request time
    this.client.interceptors.response.use(
      (response) => {
        const requestTime = Date.now() - this.requestStartTime;
        // Attach request time to response data
        if (response.data) {
          response.data._requestTime = requestTime;
        }
        return response;
      },
      (error: AxiosError) => {
        const requestTime = Date.now() - this.requestStartTime;
        const errorData = error.response?.data as { message?: string } | undefined;
        const apiError: ApiError = {
          message: errorData?.message || error.message || 'An error occurred',
          status: error.response?.status,
        };
        // Attach request time to error
        (apiError as any)._requestTime = requestTime;
        return Promise.reject(apiError);
      }
    );
  }

  async createCompletion(
    request: ConversationCompletionRequest
  ): Promise<ConversationCompletionResponse & { _requestTime?: number }> {
    try {
      const response = await this.client.post<ConversationCompletionResponse>(
        '/conversations/completions',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error;
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();

