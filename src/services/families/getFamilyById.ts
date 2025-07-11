import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';
import type { FamilyDTO } from './getFamilies';

export async function getFamilyById(familyId: string): Promise<FamilyDTO> {
  try {
    const response = await apiClient.get<{ message: string; data: FamilyDTO }>(`/families/${familyId}`);
    return (response as { message: string; data: FamilyDTO }).data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getFamilyById;
