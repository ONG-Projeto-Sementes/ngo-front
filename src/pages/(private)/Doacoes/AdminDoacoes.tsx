import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ERoutes } from '@/types/ERoutes';

// Mock data
const mockDonations = [
  {
    id: '1',
    donor: 'Maria Silva',
    category: 'Alimentos',
    description: 'Cestas básicas',
    quantity: 10,
    unit: 'unidades',
    value: 350.00,
    status: 'recebida',
    date: '2024-01-15',
    contact: '(11) 99999-9999'
  },
  {
    id: '2',
    donor: 'João Santos',
    category: 'Roupas',
    description: 'Roupas infantis',
    quantity: 25,
    unit: 'peças',
    value: 180.00,
    status: 'pendente',
    date: '2024-01-14',
    contact: '(11) 88888-8888'
  },
  {
    id: '3',
    donor: 'Ana Costa',
    category: 'Brinquedos',
    description: 'Brinquedos educativos',
    quantity: 15,
    unit: 'unidades',
    value: 320.00,
    status: 'recebida',
    date: '2024-01-13',
    contact: '(11) 77777-7777'
  },
  {
    id: '4',
    donor: 'Pedro Lima',
    category: 'Material Escolar',
    description: 'Cadernos e lápis',
    quantity: 50,
    unit: 'unidades',
    value: 150.00,
    status: 'distribuida',
    date: '2024-01-12',
    contact: '(11) 66666-6666'
  },
  {
    id: '5',
    donor: 'Carla Oliveira',
    category: 'Higiene',
    description: 'Produtos de higiene',
    quantity: 30,
    unit: 'unidades',
    value: 200.00,
    status: 'recebida',
    date: '2024-01-11',
    contact: '(11) 55555-5555'
  },
];

const mockStats = {
  totalDonations: 156,
  pendingDonations: 8,
  totalValue: 45230.50,
  totalDonors: 89,
};

const statusColors = {
  pendente: 'bg-yellow-100 text-yellow-800',
  recebida: 'bg-blue-100 text-blue-800',
  distribuida: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pendente: 'Pendente',
  recebida: 'Recebida',
  distribuida: 'Distribuída',
  cancelada: 'Cancelada',
};

export default function AdminDoacoes() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState(mockDonations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [dialogType, setDialogType] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || donation.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleView = (donation) => {
    setSelectedDonation(donation);
    setDialogType('view');
    setIsDialogOpen(true);
  };

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setDialogType('edit');
    setIsDialogOpen(true);
  };

  const handleDelete = (donation) => {
    setSelectedDonation(donation);
    setDialogType('delete');
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDonations(prev => prev.filter(d => d.id !== selectedDonation.id));
    setIsDialogOpen(false);
    setSelectedDonation(null);
  };

  const handleStatusChange = (donationId: string, newStatus: string) => {
    setDonations(prev => prev.map(d => 
      d.id === donationId ? { ...d, status: newStatus } : d
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(ERoutes.Doacoes)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Administração de Doações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as doações de forma detalhada
          </p>
        </div>
        <Button onClick={() => navigate(ERoutes.DoacoesCriar)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Doação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.pendingDonations} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Valor estimado das doações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalDonors}</div>
            <p className="text-xs text-muted-foreground">
              Doadores únicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingDonations}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por doador ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="recebida">Recebida</SelectItem>
                  <SelectItem value="distribuida">Distribuída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alimentos">Alimentos</SelectItem>
                  <SelectItem value="Roupas">Roupas</SelectItem>
                  <SelectItem value="Brinquedos">Brinquedos</SelectItem>
                  <SelectItem value="Material Escolar">Material Escolar</SelectItem>
                  <SelectItem value="Higiene">Higiene</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Doações ({filteredDonations.length})</CardTitle>
          <CardDescription>
            Lista de todas as doações filtradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doador</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.donor}</TableCell>
                    <TableCell>{donation.category}</TableCell>
                    <TableCell>{donation.description}</TableCell>
                    <TableCell>{donation.quantity} {donation.unit}</TableCell>
                    <TableCell>{formatCurrency(donation.value)}</TableCell>
                    <TableCell>
                      <Select 
                        value={donation.status} 
                        onValueChange={(value) => handleStatusChange(donation.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={statusColors[donation.status]}>
                            {statusLabels[donation.status]}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="recebida">Recebida</SelectItem>
                          <SelectItem value="distribuida">Distribuída</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(donation.date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(donation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(donation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(donation)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'view' && 'Detalhes da Doação'}
              {dialogType === 'edit' && 'Editar Doação'}
              {dialogType === 'delete' && 'Confirmar Exclusão'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'view' && 'Informações completas da doação selecionada'}
              {dialogType === 'edit' && 'Edite as informações da doação'}
              {dialogType === 'delete' && 'Esta ação não pode ser desfeita'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDonation && (
            <div className="space-y-4">
              {dialogType === 'view' && (
                <div className="space-y-3">
                  <div><strong>Doador:</strong> {selectedDonation.donor}</div>
                  <div><strong>Contato:</strong> {selectedDonation.contact}</div>
                  <div><strong>Categoria:</strong> {selectedDonation.category}</div>
                  <div><strong>Descrição:</strong> {selectedDonation.description}</div>
                  <div><strong>Quantidade:</strong> {selectedDonation.quantity} {selectedDonation.unit}</div>
                  <div><strong>Valor estimado:</strong> {formatCurrency(selectedDonation.value)}</div>
                  <div><strong>Status:</strong> 
                    <Badge className={`ml-2 ${statusColors[selectedDonation.status]}`}>
                      {statusLabels[selectedDonation.status]}
                    </Badge>
                  </div>
                  <div><strong>Data:</strong> {formatDate(selectedDonation.date)}</div>
                </div>
              )}
              
              {dialogType === 'delete' && (
                <p>Tem certeza que deseja excluir a doação de <strong>{selectedDonation.donor}</strong>?</p>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            {dialogType === 'delete' && (
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Excluir
              </Button>
            )}
            {dialogType === 'edit' && (
              <Button>
                Salvar Alterações
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
