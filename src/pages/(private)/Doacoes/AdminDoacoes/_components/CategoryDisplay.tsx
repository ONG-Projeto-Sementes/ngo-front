import { useQuery } from '@tanstack/react-query';
import { getDonationCategoryById } from '@/services/donationCategories/getDonationCategoryById';
import type { DonationCategory } from '@/pages/(private)/Doacoes/_types/DonationCategory';

interface CategoryDisplayProps {
  category?: DonationCategory;
  categoryId?: string;
}

export function CategoryDisplay({ category, categoryId }: CategoryDisplayProps) {
  const { data: fetchedCategory, isLoading } = useQuery({
    queryKey: ['donation-category', categoryId],
    queryFn: () => getDonationCategoryById(categoryId!),
    enabled: !category && !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    throwOnError: false,
  });
  
  const displayCategory = category || fetchedCategory;
  
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <span className="text-xs sm:text-sm animate-pulse">Carregando...</span>
      </div>
    );
  }
  
  if (!displayCategory) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-xs">?</span>
        </div>
        <span className="text-xs sm:text-sm text-red-500">Categoria não encontrada</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <div
        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
        style={{ backgroundColor: displayCategory.color || '#6b7280' }}
      >
        <span className="text-xs sm:text-sm">{displayCategory.icon || '📦'}</span>
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
        {displayCategory.name}
      </span>
    </div>
  );
}
