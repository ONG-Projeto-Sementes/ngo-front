import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export interface BeneficiaryEditPayload {
  name: string;
  birthDate: string;
  degreeOfKinship: string;
  genre: string;
  cpf: string;
}

export interface BeneficiaryEditResponse {
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

export async function putFamiliesBeneficiaries(
  beneficiaryId: string,
  payload: BeneficiaryEditPayload
): Promise<BeneficiaryEditResponse> {
  try {
    const response = await apiClient.put<{ message: string; data: BeneficiaryEditResponse }, BeneficiaryEditPayload>(
      `/beneficiaries/${beneficiaryId}`,
      payload
    );
    return response.data;
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default putFamiliesBeneficiaries;
