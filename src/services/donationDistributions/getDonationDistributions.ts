import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationDistributionsResponse, GetDonationDistributionsParams } from '@/pages/(private)/Doacoes/_types/Donation';

export async function getDonationDistributions(params?: GetDonationDistributionsParams): Promise<DonationDistributionsResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.donationId) queryParams.append('donationId', params.donationId);
    if (params?.familyId) queryParams.append('familyId', params.familyId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/distributions?${queryString}` : '/distributions';
    
    const response = await apiClient.get<DonationDistributionsResponse>(url);
    return response;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonationDistributions;
