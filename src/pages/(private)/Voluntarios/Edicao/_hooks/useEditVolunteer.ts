import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import getVolunteer from '@/services/volunteer/getVolunteer';
import putVolunteer from '@/services/volunteer/putVolunteer';

export interface VolunteerEditFormValues {
  name: string;
  cpf?: string;
  contact?: string;
  birthDate?: string;
  image?: FileList;
}

export function useEditVolunteer(volunteerId: string) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['volunteer', volunteerId],
    queryFn: () => getVolunteer(volunteerId),
    enabled: !!volunteerId,
  });

  const mutation = useMutation<
    Awaited<ReturnType<typeof putVolunteer>>,
    Error,
    FormData
  >({
    mutationFn: (formData: FormData) => putVolunteer(volunteerId, formData),
    onError: (error: Error) => {
      toast.error(error?.message ?? 'Erro ao atualizar voluntário.');
    },
    onSuccess: () => {
      toast.success('Voluntário atualizado com sucesso!');
      qc.invalidateQueries({ queryKey: ['volunteers'] });
      qc.invalidateQueries({ queryKey: ['volunteer', volunteerId] });
      navigate('/voluntarios');
    },
  });

  return { 
    ...query, 
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    mutationError: mutation.error,
  };
}
