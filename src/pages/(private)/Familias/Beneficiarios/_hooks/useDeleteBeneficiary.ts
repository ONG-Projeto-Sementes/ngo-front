import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { useQueryClient } from '@tanstack/react-query';
import deleteFamiliesBeneficiaries from '@/services/families/deleteFamiliesBeneficiaries';

export default function useDeleteBeneficiary(familyId: string) {
  const queryClient = useQueryClient();

  return useMutation<string, void>(
    (beneficiaryId: string) => deleteFamiliesBeneficiaries(beneficiaryId),
    {
      onError: (error: Error) => {
        toast.error(error.message || 'Erro ao excluir beneficiário.');
      },
      onSuccess: () => {
        toast.success('Beneficiário excluído com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['beneficiaries', familyId] });
      },
    }
  );
}
