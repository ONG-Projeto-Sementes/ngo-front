import { useQuery } from '@tanstack/react-query';
import { getDonationById } from '@/services/donations/getDonationById';
import type { Donation } from '@/pages/(private)/Doacoes/_types/Donation';

export default function useGetDonationById(id: string) {
  return useQuery<Donation>({
    queryKey: ['donation', id],
    queryFn: () => getDonationById(id),
    enabled: !!id,
  });
}
