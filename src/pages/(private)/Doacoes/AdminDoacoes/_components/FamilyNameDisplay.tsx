import useGetFamilyById from "@/pages/(private)/Familias/_hooks/useGetFamilyById";
import type { FamilyDTO } from '@/services/families/getFamilies';

interface FamilyNameDisplayProps {
  family?: {
    _id: string;
    name: string;
    city: string;
    neighborhood: string;
    contact: string;
  } | FamilyDTO;
  familyId: string;
}

export function FamilyNameDisplay({ family, familyId }: FamilyNameDisplayProps) {
  const { data: fetchedFamily, isLoading } = useGetFamilyById(family ? null : familyId);
  
  const displayFamily = family || fetchedFamily;
  
  if (isLoading) {
    return (
      <div className="animate-pulse min-w-0 flex-1">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 sm:w-24 mb-1"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
      </div>
    );
  }
  
  return (
    <div className="min-w-0 flex-1">
      <p className="font-medium text-sm sm:text-base truncate">
        {displayFamily?.name || `Família não encontrada (ID: ${familyId})`}
      </p>
      <p className="text-xs sm:text-sm text-muted-foreground truncate">
        {displayFamily?.neighborhood && displayFamily?.city 
          ? `${displayFamily.neighborhood}, ${displayFamily.city}`
          : 'Localização não disponível'
        }
      </p>
    </div>
  );
}
