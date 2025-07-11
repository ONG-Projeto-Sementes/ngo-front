import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getEvent, putEvent } from '@/services/events';

export interface EventEditFormValues {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  maxVolunteers?: number;
  image?: FileList;
}

export function useEditEvent(eventId: string) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  });

  const mutation = useMutation<
    Awaited<ReturnType<typeof putEvent>>,
    Error,
    FormData
  >({
    mutationFn: (formData: FormData) => putEvent(eventId, formData),
    onError: (error: Error) => {
      toast.error(error?.message ?? 'Erro ao atualizar evento.');
    },
    onSuccess: () => {
      toast.success('Evento atualizado com sucesso!');
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['event', eventId] });
      navigate('/eventos');
    },
  });

  return { 
    ...query, 
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    mutationError: mutation.error,
  };
}
