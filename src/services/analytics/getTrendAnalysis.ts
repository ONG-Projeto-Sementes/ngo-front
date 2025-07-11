import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface TrendData {
  period: string;
  trends: Array<{
    _id: {
      year: number;
      month?: number;
      day?: number;
      week?: number;
    };
    donations: number;
    totalValue: number;
    avgValue: number;
    uniqueDonors: number;
  }>;
}

export interface GetTrendParams {
  period?: 'week' | 'month' | 'quarter' | 'year';
}

export async function getTrendAnalysis(params?: GetTrendParams): Promise<TrendData> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.period) queryParams.append('period', params.period);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/analytics/trends?${queryString}` : '/analytics/trends';
    
    const response = await apiClient.get<{ message: string; data: TrendData }>(url);
    return (response as { message: string; data: TrendData }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getTrendAnalysis;
