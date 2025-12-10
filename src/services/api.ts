import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type RetryMeta = {
  retry?: number; // max retry attempts
  retryDelayMs?: number; // base delay
  retryOnStatuses?: number[]; // statuses to retry on
};

declare module 'axios' {
  // Extend AxiosRequestConfig to carry retry metadata
  export interface AxiosRequestConfig {
    retryMeta?: RetryMeta;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling + retry + 401 logout
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    // 401 => auto logout
    if (status === 401) {
      try {
        localStorage.removeItem('auth_token');
        localStorage.clear();
      } finally {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }

    // Retry mechanism (simple exponential backoff)
    const config = error.config as AxiosRequestConfig | undefined;
    if (config) {
      const meta: RetryMeta = config.retryMeta || {};
      const maxRetry = meta.retry ?? 0;
      const retryDelayMs = meta.retryDelayMs ?? 500;
      const retryOnStatuses = meta.retryOnStatuses ?? [408, 429, 500, 502, 503, 504];
      (config as any).__retryCount = ((config as any).__retryCount || 0) as number;

      const canRetry = (config as any).__retryCount < maxRetry && (
        !status || retryOnStatuses.includes(status)
      );

      if (canRetry) {
        (config as any).__retryCount += 1;
        const delay = retryDelayMs * Math.pow(2, (config as any).__retryCount - 1);
        await new Promise((r) => setTimeout(r, delay));
        return api(config);
      }
    }

    return Promise.reject(error);
  }
);

export const http = {
  get<T = any>(url: string, params?: Record<string, any>, options?: AxiosRequestConfig) {
    return api.get<T>(url, { params, ...(options || {}) }).then((r) => r.data as T);
  },
  post<T = any>(url: string, body?: any, options?: AxiosRequestConfig) {
    return api.post<T>(url, body, options).then((r) => r.data as T);
  },
  put<T = any>(url: string, body?: any, options?: AxiosRequestConfig) {
    return api.put<T>(url, body, options).then((r) => r.data as T);
  },
  delete<T = any>(url: string, options?: AxiosRequestConfig) {
    return api.delete<T>(url, options).then((r) => r.data as T);
  }
};

export default http;
