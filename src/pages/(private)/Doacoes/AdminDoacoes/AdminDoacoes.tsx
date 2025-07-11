import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Search, Plus, Edit, Trash2, Eye, MoreHorizontal, Package } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ERoutes } from '@/types/ERoutes';

// Importar hooks
// import { useDonations } from '../_hooks/useDonations';
import { useCreateDonation } from '../_hooks/useCreateDonation';

// Importar tipos
import type { Donation, GetDonationsParams } from '../_types/Donation';
import type { DonationCategory } from '../_types/DonationCategory';

// Importar schema
import { donationSchema, type DonationFormData } from '../_schemas/donation.schema';

// Mock data para categorias (será substituído por hook)
const mockCategories: DonationCategory[] = [
  { _id: '1', name: 'Alimentos', description: 'Produtos alimentícios', defaultUnit: 'kg', icon: '🍎', color: '#22c55e', isActive: true, deleted: false, createdAt: '', updatedAt: '' },
  { _id: '2', name: 'Roupas', description: 'Vestuário em geral', defaultUnit: 'peças', icon: '👕', color: '#3b82f6', isActive: true, deleted: false, createdAt: '', updatedAt: '' },
  { _id: '3', name: 'Brinquedos', description: 'Brinquedos e jogos', defaultUnit: 'unidades', icon: '🧸', color: '#8b5cf6', isActive: true, deleted: false, createdAt: '', updatedAt: '' },
];

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  received: { label: 'Recebida', color: 'bg-blue-100 text-blue-800' },
  distributed: { label: 'Distribuída', color: 'bg-green-100 text-green-800' },
  expired: { label: 'Expirada', color: 'bg-red-100 text-red-800' },
};

export default function AdminDoacoes() {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<GetDonationsParams>({
    page: 1,
    limit: 10,
  });

  // Hooks para dados reais (comentados por enquanto para usar mock)
  // const { data: donationsData, isLoading } = useDonations(filters);
  const createDonationMutation = useCreateDonation();

  // Mock data para demonstração
  const mockDonations: Donation[] = [
    {
      _id: '1',
      donorName: 'Maria Silva',
      donorContact: '(11) 99999-9999',
      categoryId: '1',
      quantity: 50,
      unit: 'kg',
      description: 'Arroz e feijão',
      estimatedValue: 250.00,
      receivedDate: '2024-01-15',
      status: 'received',
      deleted: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      _id: '2',
      donorName: 'João Santos',
      donorContact: '(11) 88888-8888',
      categoryId: '2',
      quantity: 20,
      unit: 'peças',
      description: 'Roupas infantis',
      estimatedValue: 180.00,
      receivedDate: '2024-01-14',
      status: 'pending',
      deleted: false,
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    },
  ];

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donorName: '',
      donorContact: '',
      categoryId: '',
      quantity: 0,
      unit: '',
      description: '',
      estimatedValue: 0,
      receivedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: '',
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCategoryName = (categoryId: string) => {
    return mockCategories.find(cat => cat._id === categoryId)?.name || 'Categoria não encontrada';
  };

  const handleCreateDonation = async (data: DonationFormData) => {
    try {
      await createDonationMutation.mutateAsync(data);
      toast.success('Doação criada com sucesso!');
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Erro ao criar doação');
      console.error(error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = mockCategories.find(cat => cat._id === categoryId);
    if (category) {
      form.setValue('unit', category.defaultUnit);
    }
  };

  const filteredDonations = mockDonations.filter(donation => {
    const matchesSearch = !filters.search || 
      donation.donorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      donation.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || donation.status === filters.status;
    const matchesCategory = !filters.categoryId || donation.categoryId === filters.categoryId;
    
    return matchesSearch && matchesStatus && matchesCategory;
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
            <h1 className="text-3xl font-bold tracking-tight">Administração de Doações</h1>
            <p className="text-muted-foreground">
              Gerencie todas as doações de forma detalhada
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Doação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDonations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDonations.filter(d => d.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebidas</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDonations.filter(d => d.status === 'received').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribuídas</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDonations.filter(d => d.status === 'distributed').length}
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Buscar por doador ou descrição..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="received">Recebida</SelectItem>
                <SelectItem value="distributed">Distribuída</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.categoryId || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, categoryId: value === 'all' ? undefined : value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
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
            Lista completa de todas as doações
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
                <TableRow key={donation._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{donation.donorName}</p>
                      <p className="text-sm text-muted-foreground">{donation.donorContact}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(donation.categoryId as string)}</TableCell>
                  <TableCell>
                    {donation.quantity} {donation.unit}
                  </TableCell>
                  <TableCell>
                    {donation.estimatedValue ? formatCurrency(donation.estimatedValue) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[donation.status].color}>
                      {statusConfig[donation.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(donation.receivedDate)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Donation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Doação</DialogTitle>
            <DialogDescription>
              Registre uma nova doação no sistema
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateDonation)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Doador</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="donorContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefone ou e-mail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        handleCategoryChange(value);
                      }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCategories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receivedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Recebimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <FormControl>
                        <Input placeholder="kg, peças..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Estimado (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva os itens doados..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Observações adicionais..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createDonationMutation.isPending}
                >
                  {createDonationMutation.isPending ? 'Salvando...' : 'Salvar Doação'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
