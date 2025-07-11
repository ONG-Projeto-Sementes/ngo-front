import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { Donation } from '@/pages/(private)/Doacoes/_types/Donation';

export async function getDonationsByCategory(categoryId: string): Promise<Donation[]> {
  try {
    const response = await apiClient.get<{ message: string; data: Donation[] }>(`/donations/category/${categoryId}`);
    return (response as { message: string; data: Donation[] }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonationsByCategory;
