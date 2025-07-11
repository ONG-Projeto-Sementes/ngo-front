import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { Donation, DonationPayload } from '@/pages/(private)/Doacoes/_types/Donation';

export async function postDonation(payload: DonationPayload): Promise<Donation> {
  try {
    const response = await apiClient.post<{ message: string; data: Donation }, DonationPayload>('/donations', payload);
    return (response as { message: string; data: Donation }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default postDonation;
