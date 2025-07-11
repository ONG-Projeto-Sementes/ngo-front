import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationStatsByCategory } from '@/pages/(private)/Doacoes/_types/Donation';

export async function getDonationStatsByCategory(): Promise<DonationStatsByCategory[]> {
  try {
    const response = await apiClient.get<{ message: string; data: DonationStatsByCategory[] }>('/donations/stats/by-category');
    return (response as { message: string; data: DonationStatsByCategory[] }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonationStatsByCategory;
