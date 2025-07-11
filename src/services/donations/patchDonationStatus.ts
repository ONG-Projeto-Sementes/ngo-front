import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export async function patchDonationStatus(id: string, status: 'pending' | 'received' | 'distributed'): Promise<void> {
  try {
    await apiClient.patch<void>(`/donations/${id}/status`, { status });
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default patchDonationStatus;
