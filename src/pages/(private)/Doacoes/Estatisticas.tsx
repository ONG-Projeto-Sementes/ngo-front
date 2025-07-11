import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ERoutes } from '@/types/ERoutes';

// Mock data para estatísticas
const mockStats = {
  general: {
    totalDonations: 156,
    totalValue: 45230.50,
    totalDonors: 89,
    thisMonthGrowth: 12.5,
  },
  byStatus: {
    pending: { count: 8, value: 1250.00 },
    received: { count: 98, value: 35200.00 },
    distributed: { count: 50, value: 8780.50 },
  },
  byCategory: [
    { name: 'Alimentos', count: 45, value: 18500.00, percentage: 41 },
    { name: 'Roupas', count: 32, value: 8200.00, percentage: 18 },
    { name: 'Brinquedos', count: 28, value: 7800.00, percentage: 17 },
    { name: 'Material Escolar', count: 25, value: 6500.00, percentage: 14 },
    { name: 'Higiene', count: 20, value: 3500.00, percentage: 8 },
    { name: 'Medicamentos', count: 6, value: 730.50, percentage: 2 },
  ],
  monthlyTrend: [
    { month: 'Jan', donations: 12, value: 3200 },
    { month: 'Fev', donations: 18, value: 4500 },
    { month: 'Mar', donations: 25, value: 6800 },
    { month: 'Abr', donations: 22, value: 5900 },
    { month: 'Mai', donations: 30, value: 8200 },
    { month: 'Jun', donations: 28, value: 7600 },
  ]
};

export default function EstatisticasDoacoes() {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estatísticas de Doações</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho e impacto das doações
          </p>
        </div>
      </div>

      {/* Stats Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.general.totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              Desde o início
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.general.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Valor estimado total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.general.totalDonors}</div>
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
            <div className="text-2xl font-bold">+{mockStats.general.thisMonthGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              Comparado ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats por Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doações por Status</CardTitle>
            <CardDescription>
              Distribuição das doações por status atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Pendentes</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{mockStats.byStatus.pending.count} doações</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(mockStats.byStatus.pending.value)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Recebidas</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{mockStats.byStatus.received.count} doações</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(mockStats.byStatus.received.value)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Distribuídas</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{mockStats.byStatus.distributed.count} doações</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(mockStats.byStatus.distributed.value)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>
              Evolução das doações nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStats.monthlyTrend.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="font-medium">{month.month}</span>
                  <div className="text-right">
                    <p className="font-medium">{month.donations} doações</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(month.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Doações por Categoria</CardTitle>
          <CardDescription>
            Distribuição das doações por tipo de item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.byCategory.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {category.count} doações
                    </span>
                    <Badge variant="outline">
                      {formatCurrency(category.value)}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
