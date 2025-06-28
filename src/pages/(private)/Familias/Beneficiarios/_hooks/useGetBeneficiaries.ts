import { useQuery } from '@tanstack/react-query';
import getFamiliesBeneficiaries, { type BeneficiaryDTO } from '@/services/families/getFamiliesBeneficiaries';

export default function useGetBeneficiaries(familyId: string) {
  return useQuery<BeneficiaryDTO[]>({
    queryKey: ['beneficiaries', familyId],
    queryFn: () => getFamiliesBeneficiaries(familyId),
    enabled: !!familyId,
    refetchInterval: 30_000,
  });
}
