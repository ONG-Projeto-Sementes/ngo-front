import apiClient from '@/helpers/request';
import type { DonationFormData, Donation } from '../../pages/(private)/Doacoes/_types/Donation';

export async function createDonation(data: DonationFormData): Promise<Donation> {
  const response = await apiClient.post('/donations', data) as { data: Donation };
  return response.data;
}
