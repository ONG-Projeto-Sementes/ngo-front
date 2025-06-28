import { toast } from 'sonner';
import { ERoutes } from '@/types/ERoutes';
import { useNavigate } from 'react-router-dom';
import putFamilies, { type FamilyPayload } from '@/services/families/putFamilies';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import getFamiliesById, { type FamilyDTO } from '@/services/families/getFamiliesById';

export interface FamilyEditFormValues {
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  contact: string;
}

export function useEditFamily(familyId: string) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const query = useQuery<FamilyDTO>({
    queryKey: ['family', familyId],
    queryFn: () => getFamiliesById(familyId),
    enabled: !!familyId,
  });

  const mutation = useMutation<
    Awaited<ReturnType<typeof putFamilies>>,
    Error,
    FamilyPayload
  >({
    mutationFn: (payload: FamilyPayload) => putFamilies(familyId, payload),
    onError: (error: Error) => {
      toast.error(error?.message ?? 'Erro ao atualizar família.');
    },
    onSuccess: () => {
      toast.success('Família atualizada com sucesso!');
      qc.invalidateQueries({ queryKey: ['families'] });
      qc.invalidateQueries({ queryKey: ['family', familyId] });
      navigate(ERoutes.Familias);
    },
  });

  return {
    ...query,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    mutationError: mutation.error,
  };
}
