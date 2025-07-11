import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface WidgetMetric {
  id: string;
  title: string;
  value: number | string;
  format: 'number' | 'currency' | 'percentage' | 'text';
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  description?: string;
  icon?: string;
  color?: string;
}

export interface GetWidgetMetricsParams {
  widgets?: string[]; // Array of widget IDs to fetch
}

export async function getWidgetMetrics(params?: GetWidgetMetricsParams): Promise<WidgetMetric[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.widgets && params.widgets.length > 0) {
      params.widgets.forEach(widget => queryParams.append('widgets', widget));
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/analytics/widgets?${queryString}` : '/analytics/widgets';
    
    const response = await apiClient.get<{ message: string; data: WidgetMetric[] }>(url);
    return (response as { message: string; data: WidgetMetric[] }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getWidgetMetrics;
