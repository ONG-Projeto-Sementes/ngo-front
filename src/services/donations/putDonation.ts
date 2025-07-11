import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { Donation, DonationPayload } from '@/pages/(private)/Doacoes/_types/Donation';

export async function putDonation(id: string, payload: DonationPayload): Promise<Donation> {
  try {
    const response = await apiClient.put<{ message: string; data: Donation }, DonationPayload>(`/donations/${id}`, payload);
    return (response as { message: string; data: Donation }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default putDonation;
