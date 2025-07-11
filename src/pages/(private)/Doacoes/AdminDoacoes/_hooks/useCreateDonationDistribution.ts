import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDonationDistribution } from '@/services/donationDistributions/postDonationDistribution';
import type { DonationDistributionPayload, DonationDistribution } from '@/pages/(private)/Doacoes/_types/Donation';

export default function useCreateDonationDistribution() {
  const queryClient = useQueryClient();

  return useMutation<DonationDistribution, Error, DonationDistributionPayload>({
    mutationFn: postDonationDistribution,
    onSuccess: (data) => {
      toast.success('Distribuição criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['distributions'] });
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation', data.donationId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar distribuição.');
    },
  });
}
