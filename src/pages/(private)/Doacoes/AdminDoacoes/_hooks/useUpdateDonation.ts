import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putDonation } from '@/services/donations/putDonation';
import type { DonationPayload, Donation } from '@/pages/(private)/Doacoes/_types/Donation';

export default function useUpdateDonation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<Donation, Error, DonationPayload>({
    mutationFn: (payload) => putDonation(id, payload),
    onSuccess: () => {
      toast.success('Doação atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation', id] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar doação.');
    },
  });
}
