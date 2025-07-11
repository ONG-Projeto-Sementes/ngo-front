import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationDistribution } from '@/pages/(private)/Doacoes/_types/Donation';

export async function getDonationDistributionsByFamily(familyId: string): Promise<DonationDistribution[]> {
  try {
    const response = await apiClient.get<{ message: string; data: DonationDistribution[] }>(`/families/${familyId}/donations`);
    return (response as { message: string; data: DonationDistribution[] }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonationDistributionsByFamily;
