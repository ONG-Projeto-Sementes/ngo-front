import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationDistribution, DonationDistributionPayload } from '@/pages/(private)/Doacoes/_types/Donation';

export async function postDonationDistribution(payload: DonationDistributionPayload): Promise<DonationDistribution> {
  try {
    const response = await apiClient.post<{ message: string; data: DonationDistribution }, DonationDistributionPayload>('/distributions', payload);
    return (response as { message: string; data: DonationDistribution }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default postDonationDistribution;
