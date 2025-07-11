import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDonationDistribution } from '@/services/donationDistributions/deleteDonationDistribution';

export default function useDeleteDonationDistribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDonationDistribution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-distributions'] });
    },
  });
}
