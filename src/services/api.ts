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
  baseURL: 'https://vakifkart.bezmialem.com.tr',
  timeout: 15000
});


api.interceptors.request.use((config) => {
  // Tam URL'yi birleştir
  const fullUrl = `${config.baseURL || ''}${config.url || ''}`;

  console.log('🚀 [REQUEST] Gidilen Adres:', fullUrl);
  console.log('📦 [REQUEST] Gönderilen Veri (Body):', config.data);

  return config;
}, (error) => {
  return Promise.reject(error);
});
// Centralized error handling + retry
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

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

function unwrapResponse<T>(response: AxiosResponse<any>) {
  const payload = response.data as any;
  const hasContractShape = payload && typeof payload === 'object' && 'success' in payload;

  if (hasContractShape) {
    if (payload.success === false) {
      const err = new Error(payload.message || 'Request failed');
      (err as any).response = { data: payload };
      throw err;
    }
    // For contract responses, return the inner data
    if ('data' in payload) return payload.data as T;
  }

  return payload as T;
}

export const http = {
  get<T = any>(url: string, params?: Record<string, any>, options?: AxiosRequestConfig) {
    return api.get<T>(url, { params, ...(options || {}) }).then((r) => unwrapResponse<T>(r));
  },
  post<T = any>(url: string, body?: any, options?: AxiosRequestConfig) {
    return api.post<T>(url, body, options).then((r) => unwrapResponse<T>(r));
  },
  put<T = any>(url: string, body?: any, options?: AxiosRequestConfig) {
    return api.put<T>(url, body, options).then((r) => unwrapResponse<T>(r));
  },
  delete<T = any>(url: string, options?: AxiosRequestConfig) {
    return api.delete<T>(url, options).then((r) => unwrapResponse<T>(r));
  }
};

export default http;
