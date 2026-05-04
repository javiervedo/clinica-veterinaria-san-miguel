import axios from 'axios';

export function createApiClient({ baseURL, getToken, onUnauthorized }) {
  const client = axios.create({
    baseURL,
    timeout: 15000
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) onUnauthorized?.();
      return Promise.reject(error);
    }
  );

  return client;
}

export function toApiError(err) {
  const status = err?.response?.status ?? 0;
  const message =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    'Error inesperado';
  return { status, message, raw: err };
}
