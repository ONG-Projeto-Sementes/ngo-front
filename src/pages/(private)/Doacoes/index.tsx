import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Plus,
  List,
  BarChart3,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ERoutes } from '@/types/ERoutes';

// Mock data para demonstração
const mockStats = {
  totalDonations: 156,
  totalValue: 45230.50,
  totalDonors: 89,
  thisMonthGrowth: 12.5,
  pendingDonations: 8,
  recentDonations: [
    { id: '1', donor: 'Maria Silva', value: 250.00, category: 'Alimentos', date: '2024-01-15' },
    { id: '2', donor: 'João Santos', value: 180.00, category: 'Roupas', date: '2024-01-14' },
    { id: '3', donor: 'Ana Costa', value: 320.00, category: 'Brinquedos', date: '2024-01-13' },
    { id: '4', donor: 'Pedro Lima', value: 150.00, category: 'Material Escolar', date: '2024-01-12' },
    { id: '5', donor: 'Carla Oliveira', value: 200.00, category: 'Higiene', date: '2024-01-11' },
  ]
};

const mockCategories = [
  { id: '1', name: 'Alimentos', count: 45, color: 'bg-green-100 text-green-800' },
  { id: '2', name: 'Roupas', count: 32, color: 'bg-blue-100 text-blue-800' },
  { id: '3', name: 'Brinquedos', count: 28, color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Material Escolar', count: 25, color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Higiene', count: 20, color: 'bg-pink-100 text-pink-800' },
  { id: '6', name: 'Medicamentos', count: 6, color: 'bg-red-100 text-red-800' },
];

export default function DoacoesDashboard() {
  const navigate = useNavigate();

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doações</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as doações recebidas
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(ERoutes.DoacoesCriar)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Doação
          </Button>
        </div>
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
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockStats.thisMonthGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              Comparado ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(ERoutes.DoacoesAdmin)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Administrar Doações
            </CardTitle>
            <CardDescription>
              Visualize, edite e gerencie todas as doações recebidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start">
              Acessar administração
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(ERoutes.DoacoesAnalytics)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics de Doações
            </CardTitle>
            <CardDescription>
              Acompanhe estatísticas e insights detalhados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start">
              Ver analytics completo
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(ERoutes.DoacoesCategorias)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Categorias
            </CardTitle>
            <CardDescription>
              Configure as categorias de doações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start">
              Gerenciar categorias
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Doações Recentes</CardTitle>
            <CardDescription>
              Últimas 5 doações recebidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStats.recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{donation.donor}</p>
                    <p className="text-sm text-muted-foreground">
                      {donation.category} • {formatDate(donation.date)}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {formatCurrency(donation.value)}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate(ERoutes.DoacoesAdmin)}
            >
              Ver todas
            </Button>
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>
              Distribuição das doações por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <Badge className={category.color}>
                    {category.count} doações
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate(ERoutes.DoacoesCategorias)}
            >
              Gerenciar categorias
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}