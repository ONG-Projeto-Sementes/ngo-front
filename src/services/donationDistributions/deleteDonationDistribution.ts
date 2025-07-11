import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export async function deleteDonationDistribution(id: string): Promise<void> {
  try {
    await apiClient.delete<{ message: string }>(`/distributions/${id}`);
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default deleteDonationDistribution;
