import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export async function patchDonationCategoryActivation(id: string, isActive: boolean): Promise<void> {
  try {
    await apiClient.patch<void>(`/donation-categories/${id}/activation`, { isActive });
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default patchDonationCategoryActivation;
