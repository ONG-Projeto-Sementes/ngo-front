import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { useNavigate } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import postVolunteer from '@/services/volunteer/postVolunteer';

interface VolunteerFormValues {
  name: string;
  cpf?: string;
  contact?: string;
  birthDate?: string;
  image?: FileList;
}

export default function useRegisterVolunteer(
  setPreview: (preview: string | null) => void,
  form: UseFormReturn<VolunteerFormValues>
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<FormData, Awaited<ReturnType<typeof postVolunteer>>>((formData) => postVolunteer(formData), {
    onError: (error) => {
      toast.error(error?.message ?? 'Erro desconhecido ao registrar voluntário.');
    },
    onSuccess: () => {
      toast.success('Voluntário cadastrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      navigate('/voluntarios');
      form.reset();
      setPreview(null);
    },
  });
}
