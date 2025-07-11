import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ERoutes } from '@/types/ERoutes';

// Mock data
const mockDonations = [
  {
    id: '1',
    donor: 'Maria Silva',
    contact: '(11) 99999-9999',
    category: 'Alimentos',
    quantity: 50,
    unit: 'kg',
    value: 250.00,
    status: 'received',
    date: '2024-01-15',
    description: 'Arroz e feijão'
  },
  {
    id: '2',
    donor: 'João Santos',
    contact: '(11) 88888-8888',
    category: 'Roupas',
    quantity: 20,
    unit: 'peças',
    value: 180.00,
    status: 'pending',
    date: '2024-01-14',
    description: 'Roupas infantis'
  },
  {
    id: '3',
    donor: 'Ana Costa',
    contact: '(11) 77777-7777',
    category: 'Brinquedos',
    quantity: 15,
    unit: 'unidades',
    value: 320.00,
    status: 'distributed',
    date: '2024-01-13',
    description: 'Brinquedos educativos'
  },
];

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  received: { label: 'Recebida', color: 'bg-blue-100 text-blue-800' },
  distributed: { label: 'Distribuída', color: 'bg-green-100 text-green-800' },
};

export default function ListaDoacoes() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredDonations = mockDonations.filter(donation => {
    const matchesSearch = donation.donor.toLowerCase().includes(search.toLowerCase()) ||
                         donation.category.toLowerCase().includes(search.toLowerCase()) ||
                         donation.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(ERoutes.Doacoes)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lista de Doações</h1>
            <p className="text-muted-foreground">
              Gerencie todas as doações cadastradas
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(ERoutes.DoacoesCriar)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Doação
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por doador, categoria ou descrição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="received">Recebida</SelectItem>
                <SelectItem value="distributed">Distribuída</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Doações ({filteredDonations.length})</CardTitle>
          <CardDescription>
            Lista de todas as doações cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doador</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{donation.donor}</p>
                      <p className="text-sm text-muted-foreground">{donation.contact}</p>
                    </div>
                  </TableCell>
                  <TableCell>{donation.category}</TableCell>
                  <TableCell>
                    {donation.quantity} {donation.unit}
                  </TableCell>
                  <TableCell>{formatCurrency(donation.value)}</TableCell>
                  <TableCell>
                    <Badge className={statusConfig[donation.status as keyof typeof statusConfig].color}>
                      {statusConfig[donation.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(donation.date)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
