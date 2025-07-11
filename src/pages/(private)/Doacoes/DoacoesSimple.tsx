import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, DollarSign, Users, TrendingUp, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Doacoes() {
  const navigate = useNavigate();

  // Mock data - em um caso real, isso viria dos hooks/APIs
  const stats = {
    totalDonations: 245,
    totalValue: 45250.75,
    totalDonors: 89,
    pendingCount: 12,
    receivedCount: 156,
    distributedCount: 77,
    pendingValue: 5200.30,
    receivedValue: 28450.20,
    distributedValue: 11600.25,
  };

  const recentDonations = [
    { id: '1', donorName: 'Maria Silva', description: 'Roupas infantis', value: 150.00, status: 'pending' },
    { id: '2', donorName: 'João Santos', description: 'Alimentos não perecíveis', value: 89.50, status: 'received' },
    { id: '3', donorName: 'Ana Costa', description: 'Brinquedos educativos', value: 245.00, status: 'distributed' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'distributed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'received': return 'Recebida';
      case 'distributed': return 'Distribuída';
      default: return status;
    }
  };

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
          <Button onClick={() => navigate('/doacoes/criar')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Doação
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalDonors} doadores únicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Valor estimado total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.pendingValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribuídas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.distributedCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.distributedValue)}
            </p>
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
          <div className="space-y-4">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{donation.donorName}</h4>
                  <p className="text-sm text-muted-foreground">{donation.description}</p>
                </div>
                <div className="text-right mr-4">
                  <div className="font-medium">{formatCurrency(donation.value)}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                  {getStatusLabel(donation.status)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/doacoes/lista')}
            >
              Ver Todas as Doações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/doacoes/criar')}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Plus className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium mb-1">Registrar Doação</h3>
            <p className="text-sm text-muted-foreground text-center">
              Cadastre uma nova doação recebida
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/doacoes/lista')}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Package className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium mb-1">Gerenciar Doações</h3>
            <p className="text-sm text-muted-foreground text-center">
              Visualizar e editar doações existentes
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/doacoes/categorias')}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Settings className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium mb-1">Configurar Categorias</h3>
            <p className="text-sm text-muted-foreground text-center">
              Gerenciar categorias de doações
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
