import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { useQueryClient } from '@tanstack/react-query';

// Mock function - será substituída pela API real posteriormente
const mockDeleteBeneficiary = async (beneficiaryId: string): Promise<void> => {
  // Simula uma chamada de API
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Beneficiário excluído:', beneficiaryId);
};

export default function useDeleteBeneficiary(familyId: string) {
  const queryClient = useQueryClient();

  return useMutation<string, void>(
    (beneficiaryId: string) => mockDeleteBeneficiary(beneficiaryId),
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
