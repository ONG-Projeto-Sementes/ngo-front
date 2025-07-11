import { useState } from 'react';
import { Search, Users, MapPin, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useGetFamilies from '../../../Familias/_hooks/useGetFamilies';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { FamilyDTO } from '@/services/families/getFamilies';

interface FamilySelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFamily: (family: FamilyDTO) => void;
  selectedFamilyId?: string;
}

export function FamilySelectionModal({
  open,
  onOpenChange,
  onSelectFamily,
  selectedFamilyId,
}: FamilySelectionModalProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 500);

  const { 
    data: familiesResponse, 
    isLoading: familiesLoading, 
    error: familiesError 
  } = useGetFamilies(currentPage, debouncedSearch);

  const families = Array.isArray(familiesResponse?.data) ? familiesResponse.data : [];
  const totalPages = familiesResponse?.totalPages || 1;

  const handleSelectFamily = (family: FamilyDTO) => {
    onSelectFamily(family);
    onOpenChange(false);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Selecionar Família para Distribuição</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome, cidade ou bairro..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {familiesLoading 
                ? 'Carregando...' 
                : `${familiesResponse?.total || 0} famílias encontradas`
              }
            </span>
            <span>Página {currentPage} de {totalPages}</span>
          </div>

          {/* Error State */}
          {familiesError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600 text-center">
                  Erro ao carregar famílias. Tente novamente.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Table */}
          <div className="flex-1 overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>Família</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="w-20">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familiesLoading ? (
                  // Loading skeletons
                  Array.from({ length: 8 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : families.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-3">
                        <Users className="h-12 w-12 text-gray-400" />
                        <div>
                          <p className="text-gray-500 font-medium">
                            {search ? 'Nenhuma família encontrada' : 'Nenhuma família cadastrada'}
                          </p>
                          {search && (
                            <p className="text-sm text-gray-400">
                              Tente ajustar os termos de pesquisa
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  families.map((family) => (
                    <TableRow 
                      key={family._id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedFamilyId === family._id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => handleSelectFamily(family)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{family.name}</p>
                            {selectedFamilyId === family._id && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                Selecionada
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">ID: {family._id.slice(-8)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-700">{family.city}</span>
                          </div>
                          <p className="text-sm text-gray-500">{family.neighborhood}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-700">{family.contact}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={selectedFamilyId === family._id ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFamily(family);
                          }}
                        >
                          {selectedFamilyId === family._id ? 'Selecionada' : 'Selecionar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  Primeira
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
              </div>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Última
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
