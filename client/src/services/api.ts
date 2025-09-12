// API service layer for frontend
import { queryClient } from '../lib/queryClient';

const API_BASE_URL = '/api';

// Generic API fetch utility
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Health check
export const healthCheck = () => apiRequest<{ status: string; timestamp: string }>('/health');

// OMNI2 Data services
export const omni2Service = {
  getLatest: () => apiRequest('/omni2/latest'),
  getRange: (start: string, end: string) => apiRequest(`/omni2/range?start=${start}&end=${end}`),
  create: (data: any) => apiRequest('/omni2', { method: 'POST', body: JSON.stringify(data) }),
};

// Forecasts services
export const forecastService = {
  getLatest: () => apiRequest('/forecasts/latest'),
  getAll: () => apiRequest('/forecasts'),
  create: (data: any) => apiRequest('/forecasts', { method: 'POST', body: JSON.stringify(data) }),
};

// Alerts services
export const alertService = {
  getActive: () => apiRequest('/alerts/active'),
  getAll: () => apiRequest('/alerts'),
  create: (data: any) => apiRequest('/alerts', { method: 'POST', body: JSON.stringify(data) }),
  acknowledge: (id: string) => apiRequest(`/alerts/${id}/acknowledge`, { method: 'POST' }),
};

// Model services
export const modelService = {
  predict: (data: any) => apiRequest('/model/predict', { method: 'POST', body: JSON.stringify(data) }),
  getMetrics: () => apiRequest('/model/metrics'),
  train: () => apiRequest('/model/train', { method: 'POST' }),
};

// Data sources services
export const dataSourceService = {
  getAll: () => apiRequest('/sources'),
  getStatus: (id: string) => apiRequest(`/sources/${id}/status`),
  update: (id: string, data: any) => apiRequest(`/sources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
