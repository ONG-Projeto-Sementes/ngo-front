import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface SystemAlert {
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  category?: string;
  count?: number;
  data?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export async function getSystemAlerts(): Promise<SystemAlert[]> {
  try {
    const response = await apiClient.get<{ message: string; data: SystemAlert[] }>('/analytics/alerts');
    return (response as { message: string; data: SystemAlert[] }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getSystemAlerts;
