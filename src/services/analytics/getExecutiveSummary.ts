import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface ExecutiveSummary {
  period: string;
  dateRange: {
    start: string;
    end: string;
  } | null;
  overview: {
    totalDonations: number;
    totalValue: number;
    totalDonors: number;
    avgDonationValue: number;
    growthRate: number;
  };
  topPerformers: {
    categories: Array<{
      categoryName: string;
      totalValue: number;
      percentage: number;
    }>;
    donors: Array<{
      donorName: string;
      totalValue: number;
      totalDonations: number;
    }>;
  };
  alerts: Array<{
    type: 'warning' | 'info' | 'success' | 'error';
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface GetExecutiveSummaryParams {
  period?: 'week' | 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
}

export async function getExecutiveSummary(params?: GetExecutiveSummaryParams): Promise<ExecutiveSummary> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.period) queryParams.append('period', params.period);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/analytics/executive-summary?${queryString}` : '/analytics/executive-summary';
    
    const response = await apiClient.get<{ message: string; data: ExecutiveSummary }>(url);
    return (response as { message: string; data: ExecutiveSummary }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getExecutiveSummary;
