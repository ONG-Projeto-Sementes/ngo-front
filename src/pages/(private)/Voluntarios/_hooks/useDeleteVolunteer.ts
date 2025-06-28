import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import deleteVolunteer from '@/services/volunteer/deleteVolunteer';

export default function useDeleteVolunteer(refetch: () => void) {
  return useMutation<string, void>((id) => deleteVolunteer(id), {
    onSuccess: () => {
      toast.success('Voluntário deletado com sucesso!');
      refetch();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Erro ao deletar voluntário');
    },
  });
}
