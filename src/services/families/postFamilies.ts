import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface FamilyPayload {
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  contact: string;
}

export interface FamilyResponse {
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

export async function postFamilies(payload: FamilyPayload): Promise<FamilyResponse> {
  try {
    return await apiClient.post<FamilyResponse, FamilyPayload>('/families', payload);
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default postFamilies;
