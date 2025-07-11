import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { addVolunteerToEvent, removeVolunteerFromEvent } from '@/services/events';

export function useManageEventVolunteers(refetch: () => void) {
  const addVolunteerMutation = useMutation<{ eventId: string; volunteerId: string }, void>(
    ({ eventId, volunteerId }) => addVolunteerToEvent(eventId, volunteerId),
    {
      onSuccess: () => {
        toast.success('Voluntário adicionado ao evento!');
        refetch();
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Erro ao adicionar voluntário');
      },
    }
  );

  const removeVolunteerMutation = useMutation<{ eventId: string; volunteerId: string }, void>(
    ({ eventId, volunteerId }) => removeVolunteerFromEvent(eventId, volunteerId),
    {
      onSuccess: () => {
        toast.success('Voluntário removido do evento!');
        refetch();
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Erro ao remover voluntário');
      },
    }
  );

  return {
    addVolunteer: addVolunteerMutation.mutate,
    removeVolunteer: removeVolunteerMutation.mutate,
    isAdding: addVolunteerMutation.isPending,
    isRemoving: removeVolunteerMutation.isPending,
  };
}
