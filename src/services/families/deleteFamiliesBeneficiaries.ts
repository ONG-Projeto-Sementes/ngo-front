import apiClient from '@/helpers/request';
import type { RequestError } from '@/helpers/request';

export async function deleteFamiliesBeneficiaries(
  beneficiaryId: string
): Promise<void> {
  try {
    await apiClient.delete<void>(`/beneficiaries/${beneficiaryId}`);
  } catch (err) {
    const axiosErr = err as RequestError<{ message?: string }>;
    if (axiosErr.response?.data?.message) {
      throw new Error(axiosErr.response.data.message);
    }
    throw err;
  }
}

export default deleteFamiliesBeneficiaries;
