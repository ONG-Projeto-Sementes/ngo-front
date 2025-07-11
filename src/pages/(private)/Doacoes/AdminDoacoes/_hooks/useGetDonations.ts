import { useQuery } from '@tanstack/react-query';
import { getDonations } from '@/services/donations/getDonations';
import type { DonationsResponse, GetDonationsParams } from '@/pages/(private)/Doacoes/_types/Donation';

export default function useGetDonations(params?: GetDonationsParams) {
  return useQuery<DonationsResponse>({
    queryKey: ['donations', params],
    queryFn: () => getDonations(params),
    refetchInterval: 30_000,
    throwOnError: false,
  });
}
