import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { deleteEvent } from '@/services/events';

export default function useDeleteEvent(refetch: () => void) {
  return useMutation<string, void>((id) => deleteEvent(id), {
    onSuccess: () => {
      toast.success('Evento deletado com sucesso!');
      refetch();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Erro ao deletar evento');
    },
  });
}
