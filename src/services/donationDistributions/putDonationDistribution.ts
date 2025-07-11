import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationDistribution, DonationDistributionPayload } from '@/pages/(private)/Doacoes/_types/Donation';

export async function putDonationDistribution(id: string, payload: Partial<DonationDistributionPayload>): Promise<DonationDistribution> {
  try {
    const response = await apiClient.put<{ message: string; data: DonationDistribution }, Partial<DonationDistributionPayload>>(`/distributions/${id}`, payload);
    return (response as { message: string; data: DonationDistribution }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default putDonationDistribution;
