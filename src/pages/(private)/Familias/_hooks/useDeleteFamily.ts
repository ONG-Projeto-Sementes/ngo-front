import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import deleteFamilies from '@/services/families/deleteFamilies';

export default function useDeleteFamily(refetch: () => void) {
  return useMutation<string, void>((id) => deleteFamilies(id), {
    onSuccess: () => {
      toast.success('Família deletada com sucesso!');
      refetch();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Erro ao deletar família');
    },
  });
}
