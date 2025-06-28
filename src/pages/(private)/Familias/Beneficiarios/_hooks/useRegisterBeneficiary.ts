import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import type { UseFormReturn } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import postFamiliesBeneficiaries, { type BeneficiaryPayload } from '@/services/families/postFamiliesBeneficiaries';

export default function useRegisterBeneficiary(
  familyId: string,
  form: UseFormReturn<BeneficiaryPayload>
) {
  const queryClient = useQueryClient();

  return useMutation<BeneficiaryPayload, Awaited<ReturnType<typeof postFamiliesBeneficiaries>>>(
    (payload) => postFamiliesBeneficiaries(familyId, payload),
    {
      onError: (error: Error) => {
        toast.error(error.message || 'Erro ao cadastrar beneficiário.');
      },
      onSuccess: () => {
        toast.success('Beneficiário cadastrado com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['beneficiaries', familyId] });
        form.reset();
      },
    }
  );
}
