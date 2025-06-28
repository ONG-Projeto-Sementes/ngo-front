import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { useNavigate } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import postFamilies, { type FamilyPayload } from '@/services/families/postFamilies';

export default function useRegisterFamily(form: UseFormReturn<FamilyPayload>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<FamilyPayload, Awaited<ReturnType<typeof postFamilies>>>(
    (payload) => postFamilies(payload),
    {
      onError: (error: Error) => {
        toast.error(error.message || 'Erro ao cadastrar família.');
      },
      onSuccess: () => {
        toast.success('Família cadastrada com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['families'] });
        navigate('/familias');
        form.reset();
      },
    }
  );
}
