import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { postEvent } from '@/services/events';
import type { UseFormReturn } from 'react-hook-form';
import type { EventFormValues } from '../_types';

export default function useCreateEvent(
  setPreview: (preview: string | null) => void,
  form: UseFormReturn<EventFormValues>
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<FormData, Awaited<ReturnType<typeof postEvent>>>((formData) => postEvent(formData), {
    onError: (error) => {
      toast.error(error?.message ?? 'Erro desconhecido ao criar evento.');
    },
    onSuccess: () => {
      toast.success('Evento criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/eventos');
      form.reset();
      setPreview(null);
    },
  });
}
