import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { DonationCategoriesResponse } from '@/pages/(private)/Doacoes/_types/DonationCategory';

export interface GetDonationCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export async function getDonationCategories(params?: GetDonationCategoriesParams): Promise<DonationCategoriesResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/donation-categories?${queryString}` : '/donation-categories';
    
    return await apiClient.get<DonationCategoriesResponse>(url);
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getDonationCategories;
