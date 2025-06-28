import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import putFamiliesBeneficiaries, { type BeneficiaryEditPayload } from '@/services/families/putFamiliesBeneficiaries';
import getFamiliesBeneficiaryById, { type BeneficiaryDTO } from '@/services/families/getFamiliesBeneficiaryById';
import { ERoutes } from '@/types/ERoutes';

export default function useEditBeneficiary(
  familyId: string,
  beneficiaryId: string
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query para buscar os dados do beneficiário
  const query = useQuery<BeneficiaryDTO>({
    queryKey: ['beneficiary', familyId, beneficiaryId],
    queryFn: () => getFamiliesBeneficiaryById(beneficiaryId),
    enabled: !!familyId && !!beneficiaryId,
  });

  // Mutation para editar o beneficiário
  const mutation = useMutation<BeneficiaryEditPayload, Awaited<ReturnType<typeof putFamiliesBeneficiaries>>>(
    (payload) => putFamiliesBeneficiaries(beneficiaryId, payload),
    {
      onError: (error: Error) => {
        toast.error(error.message || 'Erro ao atualizar beneficiário.');
      },
      onSuccess: () => {
        toast.success('Beneficiário atualizado com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['beneficiaries', familyId] });
        queryClient.invalidateQueries({ queryKey: ['beneficiary', familyId, beneficiaryId] });
        navigate(`${ERoutes.FamiliasEditar}/${familyId}`);
      },
    }
  );

  return {
    ...query,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    mutationError: mutation.error,
  };
}
