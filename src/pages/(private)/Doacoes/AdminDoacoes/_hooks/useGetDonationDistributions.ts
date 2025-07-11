import { useQuery } from '@tanstack/react-query';
import { getDonationDistributionsByDonation } from '@/services/donationDistributions/getDonationDistributionsByDonation';
import type { DonationDistribution } from '@/pages/(private)/Doacoes/_types/Donation';

export default function useGetDonationDistributions(donationId: string) {
  return useQuery<DonationDistribution[]>({
    queryKey: ['distributions', donationId],
    queryFn: () => getDonationDistributionsByDonation(donationId),
    enabled: !!donationId,
    refetchInterval: 30_000,
    throwOnError: false,
  });
}
