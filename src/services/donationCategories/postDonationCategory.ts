import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationCategory, DonationCategoryPayload } from '@/pages/(private)/Doacoes/_types/DonationCategory';

export async function postDonationCategory(payload: DonationCategoryPayload): Promise<DonationCategory> {
  try {
    const response = await apiClient.post<{ message: string; data: DonationCategory }, DonationCategoryPayload>('/donation-categories', payload);
    return (response as { message: string; data: DonationCategory }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default postDonationCategory;
