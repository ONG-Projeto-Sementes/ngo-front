import { useQuery } from '@tanstack/react-query';
import { getFamilyById } from '@/services/families/getFamilyById';
import type { FamilyDTO } from '@/services/families/getFamilies';

export default function useGetFamilyById(familyId: string | null) {
  return useQuery<FamilyDTO>({
    queryKey: ['family', familyId],
    queryFn: () => getFamilyById(familyId!),
    enabled: !!familyId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    throwOnError: false,
  });
}
