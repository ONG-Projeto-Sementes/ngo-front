import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationStats } from '@/pages/(private)/Doacoes/_types/Donation';

export async function getDonationStats(): Promise<DonationStats> {
  try {
    const response = await apiClient.get<{ message: string; data: DonationStats }>('/donations/stats');
    return (response as { message: string; data: DonationStats }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonationStats;
