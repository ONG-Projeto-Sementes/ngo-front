import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface BeneficiaryDTO {
  _id: string;
  name: string;
  birthDate: string;
  degreeOfKinship: string;
  genre: string;
  cpf: string;
  family: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getFamiliesBeneficiaries(
  familyId: string
): Promise<BeneficiaryDTO[]> {
  try {
    return await apiClient.get<BeneficiaryDTO[]>(
      `/families/${familyId}/beneficiaries`
    );
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default getFamiliesBeneficiaries;
