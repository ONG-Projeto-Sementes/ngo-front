import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationCategory, DonationCategoryPayload } from '@/pages/(private)/Doacoes/_types/DonationCategory';

export async function putDonationCategory(id: string, payload: DonationCategoryPayload): Promise<DonationCategory> {
  try {
    const response = await apiClient.put<{ message: string; data: DonationCategory }, DonationCategoryPayload>(`/donation-categories/${id}`, payload);
    return (response as { message: string; data: DonationCategory }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default putDonationCategory;
