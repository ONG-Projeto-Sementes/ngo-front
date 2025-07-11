import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface DonorAnalytics {
  donorStats: Array<{
    donorName: string;
    contact?: string;
    totalDonations: number;
    totalValue: number;
    avgValue: number;
    categoriesCount: number;
    firstDonation: string;
    lastDonation: string;
    pendingDonations: number;
    receivedDonations: number;
    distributedDonations: number;
    daysSinceFirst: number;
    daysSinceLast: number;
  }>;
  segmentation: Array<{
    _id: string | number;
    count: number;
    avgDonations: number;
    totalValue: number;
  }>;
}

export interface GetDonorAnalyticsParams {
  startDate?: string;
  endDate?: string;
}

export async function getDonorAnalytics(params?: GetDonorAnalyticsParams): Promise<DonorAnalytics> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/analytics/donors?${queryString}` : '/analytics/donors';
    
    const response = await apiClient.get<{ message: string; data: DonorAnalytics }>(url);
    return (response as { message: string; data: DonorAnalytics }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonorAnalytics;
