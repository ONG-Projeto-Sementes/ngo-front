import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface FamilyDTO {
  _id: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  contact: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FamiliesResponse {
  data: FamilyDTO[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  message?: string;
}

export async function getFamilies(page: number = 1, search: string = ""): Promise<FamiliesResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      ...(search && { search })
    });
    
    return await apiClient.get<FamiliesResponse>(`/families?${queryParams}`);
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getFamilies;
