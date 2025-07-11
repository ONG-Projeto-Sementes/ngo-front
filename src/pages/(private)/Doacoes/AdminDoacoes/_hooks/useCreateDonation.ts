import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDonation } from '@/services/donations/postDonation';
import type { DonationPayload, Donation } from '@/pages/(private)/Doacoes/_types/Donation';

export default function useCreateDonation() {
  const queryClient = useQueryClient();

  return useMutation<Donation, Error, DonationPayload>({
    mutationFn: postDonation,
    onSuccess: () => {
      toast.success('Doação criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar doação.');
    },
  });
}
