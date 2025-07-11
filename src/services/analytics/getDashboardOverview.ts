import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface DashboardOverview {
  period: string;
  dateRange: {
    start: string;
    end: string;
  } | null;
  summary: {
    totalDonations: number;
    totalValue: number;
    totalQuantity: number;
    avgDonationValue: number;
    totalDonors: number;
  };
  statusBreakdown: Array<{
    status: string;
    count: number;
    totalValue: number;
    totalQuantity: number;
    percentage: string;
  }>;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    categoryIcon?: string;
    categoryColor?: string;
    count: number;
    totalValue: number;
    totalQuantity: number;
    percentage: string;
  }>;
  topDonors: Array<{
    name: string;
    contact?: string;
    totalDonations: number;
    totalValue: number;
    lastDonation: string;
  }>;
  recentActivity: Array<{
    _id: string;
    donorName: string;
    category: {
      categoryId: string;
      categoryName: string;
      categoryIcon?: string;
      categoryColor?: string;
    };
    quantity: number;
    unit: string;
    estimatedValue?: number;
    status: string;
    receivedDate: string;
  }>;
}

export interface GetDashboardParams {
  startDate?: string;
  endDate?: string;
  period?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
  categoryId?: string;
}

export async function getDashboardOverview(params?: GetDashboardParams): Promise<DashboardOverview> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.period) queryParams.append('period', params.period);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);

    const queryString = queryParams.toString();
    const url = queryString ? `/analytics/dashboard?${queryString}` : '/analytics/dashboard';

    const response = await apiClient.get<{ message: string; data: DashboardOverview }>(url);
    return (response as { message: string; data: DashboardOverview }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDashboardOverview;
