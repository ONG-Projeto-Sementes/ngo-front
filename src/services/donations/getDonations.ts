import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationsResponse, GetDonationsParams } from '@/pages/(private)/Doacoes/_types/Donation';

export async function getDonations(params?: GetDonationsParams): Promise<DonationsResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.donor) queryParams.append('donor', params.donor);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    // Adicionar populate para carregar a categoria
    queryParams.append('populate', 'categoryId');
    
    const queryString = queryParams.toString();
    const url = queryString ? `/donations?${queryString}` : '/donations';
    
    return await apiClient.get<DonationsResponse>(url);
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonations;
