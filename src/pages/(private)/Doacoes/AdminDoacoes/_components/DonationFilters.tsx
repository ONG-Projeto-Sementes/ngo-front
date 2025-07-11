import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDonationCategories } from '../../Categorias/_hooks/useDonationCategories';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { GetDonationsParams } from '../../_types/Donation';
import type { DonationCategory } from '../../_types/DonationCategory';

interface DonationFiltersProps {
  filters: GetDonationsParams;
  onFiltersChange: (filters: GetDonationsParams) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'received', label: 'Recebidas' },
  { value: 'distributed', label: 'Distribuídas' },
  { value: 'expired', label: 'Expiradas' },
];

export function DonationFilters({
  filters,
  onFiltersChange,
  onCreateNew,
  isLoading = false,
}: DonationFiltersProps) {
  const { data: categoriesResponse } = useDonationCategories();
  const categories = Array.isArray(categoriesResponse?.data?.data) ? categoriesResponse.data.data : [];

  // Estado local para o input de busca
  const [searchValue, setSearchValue] = useState(filters.search || '');
  
  // Debounce do valor de busca
  const debouncedSearchValue = useDebouncedValue(searchValue, 500);

  // Atualizar filtros quando o valor de busca debounced mudar
  useEffect(() => {
    if (debouncedSearchValue !== filters.search) {
      const newFilters = { 
        page: 1,
        limit: filters.limit || 12,
        search: debouncedSearchValue || undefined,
        categoryId: filters.categoryId,
        status: filters.status
      };
      onFiltersChange(newFilters);
    }
  }, [debouncedSearchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = (search: string) => {
    setSearchValue(search);
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ 
      ...filters, 
      status: status === 'all' ? undefined : status as 'pending' | 'received' | 'distributed' | 'expired',
      page: 1 
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { 
      ...filters, 
      categoryId: categoryId === 'all' ? undefined : categoryId, 
      page: 1 
    };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setSearchValue(''); // Limpar estado local da busca
    onFiltersChange({ page: 1, limit: 12 });
  };

  const hasActiveFilters = filters.search || filters.status || filters.categoryId;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <h3 className="font-medium text-sm sm:text-base">Filtros</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Filtros ativos
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={onCreateNew} 
          disabled={isLoading} 
          className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-auto sm:self-start text-sm sm:text-base"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Doação
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por doador, descrição..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Status Filter */}
          <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full text-sm sm:text-base">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-sm sm:text-base">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={filters.categoryId || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full text-sm sm:text-base">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm sm:text-base">Todas as Categorias</SelectItem>
              {categories.filter((cat: DonationCategory) => cat.isActive).map((category: DonationCategory) => (
                <SelectItem key={category._id} value={category._id} className="text-sm sm:text-base">
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            className="w-full sm:w-auto text-sm sm:text-base"
            size="sm"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
