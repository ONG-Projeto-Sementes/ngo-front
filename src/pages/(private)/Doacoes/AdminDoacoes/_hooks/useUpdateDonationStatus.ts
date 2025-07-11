import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchDonationStatus } from '@/services/donations/patchDonationStatus';

export default function useUpdateDonationStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; status: 'pending' | 'received' | 'distributed' }>({
    mutationFn: ({ id, status }) => patchDonationStatus(id, status),
    onSuccess: () => {
      toast.success('Status da doação atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar status da doação.');
    },
  });
}
