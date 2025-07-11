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

export async function getFamiliesById(id: string): Promise<FamilyDTO> {
  try {
    const response = await apiClient.get<{ message: string; data: FamilyDTO }>(`/families/${id}`);
    return response.data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getFamiliesById;
