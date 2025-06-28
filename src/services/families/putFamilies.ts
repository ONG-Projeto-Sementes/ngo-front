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

export async function putFamilies(
  id: string,
  payload: FamilyPayload
): Promise<FamilyResponse> {
  try {
    return await apiClient.put<FamilyResponse, FamilyPayload>(
      `/families/${id}`,
      payload
    );
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default putFamilies;
