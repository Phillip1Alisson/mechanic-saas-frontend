
import { API_CONFIG, STORAGE_KEYS, APP_MESSAGES } from '../constants';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  params?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

interface ApiEnvelope<T> {
  status?: 'success' | 'error';
  data?: T;
  message?: string;
  [key: string]: any;
}

const BASE_URL = (API_CONFIG.BASE_URL || '').replace(/\/+$/, '');

const buildUrl = (path: string, params?: Record<string, unknown>) => {
  const sanitizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${BASE_URL}${sanitizedPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => appendParam(url.searchParams, key, value));
  }

  return url.toString();
};

const appendParam = (searchParams: URLSearchParams, key: string, value: unknown) => {
  if (value === undefined || value === null || value === '') return;

  if (Array.isArray(value)) {
    value.forEach(v => appendParam(searchParams, key, v));
    return;
  }

  if (typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
      appendParam(searchParams, `${key}[${nestedKey}]`, nestedValue);
    });
    return;
  }

  searchParams.append(key, String(value));
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const rawText = await response.text();
  let payload: ApiEnvelope<T> | string | null = null;

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = rawText;
    }
  }

  const messageFromPayload =
    typeof payload === 'object' && payload && 'message' in payload
      ? String(payload.message)
      : APP_MESSAGES.GENERAL.GENERIC_ERROR;

  if (!response.ok) {
    throw new Error(messageFromPayload);
  }

  if (payload && typeof payload === 'object' && 'status' in payload) {
    if (payload.status === 'error') {
      throw new Error(messageFromPayload);
    }

    return ((payload as ApiEnvelope<T>).data ?? (payload as unknown)) as T;
  }

  if (payload !== null) {
    return payload as T;
  }

  return {} as T;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const {
    method = 'GET',
    params,
    body,
    headers = {},
    requiresAuth = true,
  } = options;

  const url = buildUrl(path, params);
  const finalHeaders: Record<string, string> = { ...headers };

  if (!(body instanceof FormData)) {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
  }

  if (requiresAuth) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });

    return await parseResponse<T>(response);
  } catch (error) {
    console.error(`[API ERROR] ${method} ${url}`, error);
    const message = error instanceof Error ? error.message : APP_MESSAGES.GENERAL.GENERIC_ERROR;
    throw new Error(message);
  }
};

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
