import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface BeneficiaryPayload {
  name: string;
  birthDate: string;
  degreeOfKinship: string;
  genre: string;
  cpf: string;
}

export interface BeneficiaryResponse {
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

export async function postFamiliesBeneficiaries(
  familyId: string,
  payload: BeneficiaryPayload
): Promise<BeneficiaryResponse> {
  try {
    return await apiClient.post<BeneficiaryResponse, BeneficiaryPayload>(
      `/families/${familyId}/beneficiaries`,
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

export default postFamiliesBeneficiaries;
