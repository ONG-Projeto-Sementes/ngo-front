import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { Donation, DonationFormData } from '@/pages/(private)/Doacoes/_types/Donation';

export async function createDonation(data: DonationFormData): Promise<Donation> {
  try {
    const response = await apiClient.post<{ message: string; data: Donation }, DonationFormData>('/donations', data);
    return (response as { message: string; data: Donation }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}
