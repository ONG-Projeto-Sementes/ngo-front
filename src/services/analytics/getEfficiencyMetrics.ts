import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface EfficiencyMetrics {
  statusEfficiency: Array<{
    _id: string;
    count: number;
    avgValue: number;
    avgProcessingTime: number;
  }>;
  categoryEfficiency: Array<{
    _id: string;
    categoryName: string;
    totalDonations: number;
    distributedCount: number;
    avgProcessingTime: number;
    distributionRate: number;
  }>;
  overallMetrics: {
    avgProcessingTime: number;
    minProcessingTime: number;
    maxProcessingTime: number;
    totalProcessed: number;
  };
}

export async function getEfficiencyMetrics(): Promise<EfficiencyMetrics> {
  try {
    const response = await apiClient.get<{ message: string; data: EfficiencyMetrics }>('/analytics/efficiency');
    return (response as { message: string; data: EfficiencyMetrics }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getEfficiencyMetrics;
