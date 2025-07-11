import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { Donation } from '@/pages/(private)/Doacoes/_types/Donation';

export async function getDonationById(id: string): Promise<Donation> {
  try {
    const response = await apiClient.get<{ message: string; data: Donation }>(`/donations/${id}`);
    return (response as { message: string; data: Donation }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonationById;
