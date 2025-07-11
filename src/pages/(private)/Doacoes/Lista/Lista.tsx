import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDonations } from './_hooks/useDonations';
import { useDonationCategories } from '../Categorias/_hooks/useDonationCategories';
import type { Donation } from '../_types/Donation';
import { useNavigate } from 'react-router-dom';
import { ERoutes } from '@/types/ERoutes';

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
  received: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Recebida' },
  distributed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Distribuída' },
};

export default function ListaDoacoes() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const { data: donationsResponse, isLoading } = useDonations({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    categoryId: categoryFilter || undefined,
  });

  const { data: categoriesResponse } = useDonationCategories({
    limit: 100,
  });

  const handleCreate = () => {
    navigate(ERoutes.DoacoesCriar);
  };

  const handleEdit = (donation: Donation) => {
    navigate(ERoutes.DoacoesEditar.replace(':id', donation._id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Doações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as doações recebidas e distribuídas
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por doador, descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Doação
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="received">Recebida</SelectItem>
              <SelectItem value="distributed">Distribuída</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categoriesResponse?.data?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : donationsResponse?.data?.length ? (
        <div className="space-y-4">
          {donationsResponse.data.map((donation) => {
            const category = categoriesResponse?.data?.find(
              (cat) => cat._id === donation.categoryId
            );
            const status = statusColors[donation.status as keyof typeof statusColors];

            return (
              <Card key={donation._id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{donation.donorName}</h3>
                        <Badge className={`${status.bg} ${status.text}`}>
                          {status.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Categoria:</span> {category?.icon} {category?.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Quantidade:</span> {donation.quantity} {donation.unit}
                        </div>
                        <div>
                          <span className="font-medium">Valor estimado:</span> {formatCurrency(donation.estimatedValue)}
                        </div>
                        <div>
                          <span className="font-medium">Data:</span> {formatDate(donation.receivedDate)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-2">{donation.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>
                          <span className="font-medium">Contato:</span> {donation.donorContact}
                        </span>
                        {donation.notes && (
                          <span>
                            <span className="font-medium">Observações:</span> {donation.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(donation)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {search || statusFilter || categoryFilter 
                ? 'Nenhuma doação encontrada com os filtros aplicados' 
                : 'Nenhuma doação registrada ainda'
              }
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primeira Doação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
