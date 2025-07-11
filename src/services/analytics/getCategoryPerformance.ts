import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface CategoryPerformance {
  _id: string;
  categoryName: string;
  categoryIcon?: string;
  categoryColor?: string;
  totalDonations: number;
  totalValue: number;
  totalQuantity: number;
  avgValue: number;
  avgQuantity: number;
  pendingCount: number;
  receivedCount: number;
  distributedCount: number;
  uniqueDonors: number;
  lastDonation: string;
  firstDonation: string;
  efficiency: number;
}

export async function getCategoryPerformance(): Promise<CategoryPerformance[]> {
  try {
    const response = await apiClient.get<{ message: string; data: CategoryPerformance[] }>('/analytics/categories');
    return (response as { message: string; data: CategoryPerformance[] }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getCategoryPerformance;
