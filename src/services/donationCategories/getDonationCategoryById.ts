import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationCategory } from '@/pages/(private)/Doacoes/_types/DonationCategory';

export async function getDonationCategoryById(id: string): Promise<DonationCategory> {
  try {
    const response = await apiClient.get<{ message: string; data: DonationCategory }>(`/donation-categories/${id}`);
    return (response as { message: string; data: DonationCategory }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonationCategoryById;
