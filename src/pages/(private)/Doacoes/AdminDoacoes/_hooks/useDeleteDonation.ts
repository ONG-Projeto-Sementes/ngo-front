import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDonation } from '@/services/donations/deleteDonation';

export default function useDeleteDonation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteDonation,
    onSuccess: () => {
      toast.success('Doação excluída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir doação.');
    },
  });
}
