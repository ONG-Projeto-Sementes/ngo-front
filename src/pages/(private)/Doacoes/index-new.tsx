import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Plus, 
  Settings, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  AlertCircle,
  MoreHorizontal 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Hooks
import { useDonations } from './Lista/_hooks/useDonations';
import { useDonationCategories } from './_hooks/useDonationCategories';
import { useDonationStats } from './Estatisticas/_hooks/useDonationStats';
import { useCreateDonation } from './_hooks/useCreateDonation';
import { useUpdateDonation } from './Lista/_hooks/useUpdateDonation';
import { useUpdateDonationStatus } from './Lista/_hooks/useUpdateDonationStatus';

// Types
import type { Donation, DonationPayload, GetDonationsParams } from './_types/Donation';

// Schema de validação
const donationSchema = z.object({
  donorName: z.string().min(1, 'Nome do doador é obrigatório'),
  donorContact: z.string().optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  description: z.string().optional(),
  estimatedValue: z.number().min(0, 'Valor deve ser maior ou igual a 0').optional(),
  receivedDate: z.string().min(1, 'Data é obrigatória'),
  status: z.enum(['pending', 'received', 'distributed', 'expired']).default('pending'),
  notes: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function DoacoesDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  
  // Filtros para lista de doações
  const [filters, setFilters] = useState<GetDonationsParams>({
    page: 1,
    limit: 10,
  });

  // Hooks
  const { data: statsData, isLoading: statsLoading } = useDonationStats();
  const { data: donationsData, isLoading: donationsLoading } = useDonations(filters);
  const { data: categoriesData, isLoading: categoriesLoading } = useDonationCategories({ limit: 100 });
  
  // Mutations
  const createDonationMutation = useCreateDonation();
  const updateDonationMutation = useUpdateDonation();
  const updateStatusMutation = useUpdateDonationStatus();

  // Form
  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donorName: '',
      donorContact: '',
      categoryId: '',
      quantity: 1,
      unit: '',
      description: '',
      estimatedValue: 0,
      receivedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: '',
    },
  });

  // Data processing
  const stats = statsData || {
    totalDonations: 0,
    totalValue: 0,
    totalDonors: 0,
    pendingDonations: 0,
    receivedDonations: 0,
    distributedDonations: 0,
    pendingValue: 0,
    receivedValue: 0,
    distributedValue: 0,
  };
  
  const donations = donationsData?.data?.data || [];
  const categories = categoriesData?.data?.data || [];
  
  // Recent donations for overview
  const recentDonations = donations.slice(0, 5);

  // Utility functions
  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'distributed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'received': return 'Recebida';
      case 'distributed': return 'Distribuída';
      case 'expired': return 'Expirada';
      default: return status;
    }
  };

  const getCategoryName = (categoryId: string | object) => {
    if (typeof categoryId === 'object' && categoryId !== null) {
      return (categoryId as { name: string }).name || 'N/A';
    }
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || 'N/A';
  };

  // Handlers
  const handleCreateDonation = async (data: DonationFormData) => {
    try {
      const payload: DonationPayload = {
        donorName: data.donorName,
        donorContact: data.donorContact,
        categoryId: data.categoryId,
        quantity: data.quantity,
        unit: data.unit,
        description: data.description,
        estimatedValue: data.estimatedValue,
        receivedDate: data.receivedDate,
        status: data.status,
        notes: data.notes,
      };

      await createDonationMutation.mutateAsync(payload);
      toast.success('Doação criada com sucesso!');
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Erro ao criar doação: ' + (error as Error).message);
    }
  };

  const handleEditDonation = (donation: Donation) => {
    setEditingDonation(donation);
    
    // Populate form with existing data
    form.reset({
      donorName: donation.donorName,
      donorContact: donation.donorContact || '',
      categoryId: typeof donation.categoryId === 'string' ? donation.categoryId : donation.categoryId._id,
      quantity: donation.quantity,
      unit: donation.unit,
      description: donation.description || '',
      estimatedValue: donation.estimatedValue || 0,
      receivedDate: donation.receivedDate.split('T')[0],
      status: donation.status,
      notes: donation.notes || '',
    });
    
    setIsEditDialogOpen(true);
  };

  const handleUpdateDonation = async (data: DonationFormData) => {
    if (!editingDonation) return;

    try {
      const payload: DonationPayload = {
        donorName: data.donorName,
        donorContact: data.donorContact,
        categoryId: data.categoryId,
        quantity: data.quantity,
        unit: data.unit,
        description: data.description,
        estimatedValue: data.estimatedValue,
        receivedDate: data.receivedDate,
        status: data.status,
        notes: data.notes,
      };

      await updateDonationMutation.mutateAsync({
        id: editingDonation._id,
        data: payload,
      });
      
      toast.success('Doação atualizada com sucesso!');
      setIsEditDialogOpen(false);
      setEditingDonation(null);
      form.reset();
    } catch (error) {
      toast.error('Erro ao atualizar doação: ' + (error as Error).message);
    }
  };

  const handleStatusChange = async (donationId: string, newStatus: 'pending' | 'received' | 'distributed' | 'expired') => {
    try {
      await updateStatusMutation.mutateAsync({
        id: donationId,
        status: newStatus as 'pending' | 'received' | 'distributed',
      });
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar status: ' + (error as Error).message);
    }
  };

  const handleFilterChange = (newFilters: Partial<GetDonationsParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Component to render form fields
  const DonationFormFields = ({ onSubmit }: { onSubmit: (data: DonationFormData) => void }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="donorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Doador *</FormLabel>
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
                  <Input placeholder="Telefone ou email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="received">Recebida</SelectItem>
                    <SelectItem value="distributed">Distribuída</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
                <FormLabel>Unidade *</FormLabel>
                <FormControl>
                  <Input placeholder="kg, unidades, litros..." {...field} />
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
                <FormLabel>Valor Estimado</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="receivedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Recebimento *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os itens doados..." 
                  rows={3}
                  {...field} 
                />
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
                <Textarea 
                  placeholder="Observações adicionais..." 
                  rows={2}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
              setEditingDonation(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={createDonationMutation.isPending || updateDonationMutation.isPending}
          >
            {(createDonationMutation.isPending || updateDonationMutation.isPending) 
              ? 'Salvando...' 
              : editingDonation ? 'Atualizar Doação' : 'Salvar Doação'
            }
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doações</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as doações da organização
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/doacoes/categorias')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Categorias
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Doação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Doação</DialogTitle>
                <DialogDescription>
                  Registre uma nova doação no sistema
                </DialogDescription>
              </DialogHeader>
              
              <DonationFormFields onSubmit={handleCreateDonation} />
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Doação</DialogTitle>
                <DialogDescription>
                  Atualize as informações da doação
                </DialogDescription>
              </DialogHeader>
              
              <DonationFormFields onSubmit={handleUpdateDonation} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="donations">Doações</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalDonations}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalDonors} doadores únicos
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
                    <p className="text-xs text-muted-foreground">
                      Valor estimado total
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.pendingDonations}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(stats.pendingValue)}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distribuídas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.distributedDonations}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(stats.distributedValue)}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Doações Recentes</CardTitle>
              <CardDescription>
                Últimas doações registradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {donationsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : recentDonations.length > 0 ? (
                <div className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div key={donation._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{donation.donorName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {donation.description || 'Sem descrição'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {getCategoryName(donation.categoryId)}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {donation.quantity} {donation.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <div className="font-medium">{formatCurrency(donation.estimatedValue)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(donation.receivedDate)}
                        </div>
                      </div>
                      <Badge className={getStatusColor(donation.status)}>
                        {getStatusLabel(donation.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma doação encontrada</p>
                </div>
              )}
              
              {recentDonations.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('donations')}
                  >
                    Ver Todas as Doações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Plus className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium mb-1">Registrar Doação</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Cadastre uma nova doação recebida
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => setActiveTab('donations')}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Package className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium mb-1">Gerenciar Doações</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Visualizar e editar doações existentes
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => navigate('/doacoes/categorias')}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Settings className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium mb-1">Configurar Categorias</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Gerenciar categorias de doações
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar doações..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
                    className="pl-8"
                  />
                </div>
                
                <Select
                  value={filters.categoryId || ''}
                  onValueChange={(value) => handleFilterChange({ categoryId: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => handleFilterChange({ status: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="received">Recebida</SelectItem>
                    <SelectItem value="distributed">Distribuída</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ page: 1, limit: 10 })}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Donations List */}
          <div className="space-y-4">
            {donationsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-60 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : donations.length > 0 ? (
              donations.map((donation) => (
                <Card key={donation._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{donation.donorName}</h3>
                          <Badge className={getStatusColor(donation.status)}>
                            {getStatusLabel(donation.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                          <div>
                            <span className="font-medium">Categoria:</span> {getCategoryName(donation.categoryId)}
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
                        
                        {donation.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {donation.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {donation.donorContact && (
                            <span>
                              <span className="font-medium">Contato:</span> {donation.donorContact}
                            </span>
                          )}
                          {donation.notes && (
                            <span>
                              <span className="font-medium">Obs:</span> {donation.notes}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Status
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(donation._id, 'pending')}
                            >
                              Pendente
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(donation._id, 'received')}
                            >
                              Recebida
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(donation._id, 'distributed')}
                            >
                              Distribuída
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(donation._id, 'expired')}
                            >
                              Expirada
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditDonation(donation)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">Nenhuma doação encontrada</CardTitle>
                  <CardDescription className="text-center mb-4">
                    Não foram encontradas doações com os filtros aplicados
                  </CardDescription>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeira Doação
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {donations.length > 0 && donationsData?.data && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {((filters.page || 1) - 1) * (filters.limit || 10) + 1} a{' '}
                {Math.min((filters.page || 1) * (filters.limit || 10), donationsData.data.total)} de{' '}
                {donationsData.data.total} doações
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
                  disabled={!filters.page || filters.page <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
                  disabled={!donationsData.data.totalPages || (filters.page || 1) >= donationsData.data.totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Settings className="h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Gerenciar Categorias</CardTitle>
              <CardDescription className="text-center mb-4">
                Configure as categorias para organizar suas doações
              </CardDescription>
              <Button onClick={() => navigate('/doacoes/categorias')}>
                Gerenciar Categorias
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
