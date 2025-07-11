import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ERoutes } from '@/types/ERoutes';

// Mock data para analytics
const mockAnalytics = {
  overview: {
    totalDonations: 456,
    totalValue: 125430.75,
    totalDonors: 234,
    growthRate: 15.2,
  },
  trends: [
    { month: 'Jan', donations: 32, value: 8500 },
    { month: 'Fev', donations: 45, value: 12200 },
    { month: 'Mar', donations: 38, value: 9800 },
    { month: 'Abr', donations: 52, value: 15600 },
    { month: 'Mai', donations: 61, value: 18200 },
    { month: 'Jun', donations: 48, value: 14100 },
  ],
  categories: [
    { name: 'Alimentos', donations: 145, value: 45200, percentage: 36 },
    { name: 'Roupas', donations: 98, value: 28600, percentage: 23 },
    { name: 'Brinquedos', donations: 76, value: 22400, percentage: 18 },
    { name: 'Material Escolar', donations: 65, value: 16800, percentage: 14 },
    { name: 'Higiene', donations: 45, value: 8900, percentage: 10 },
    { name: 'Medicamentos', donations: 27, value: 3530, percentage: 6 },
  ],
  topDonors: [
    { name: 'Maria Silva', donations: 12, value: 3200 },
    { name: 'João Santos', donations: 8, value: 2800 },
    { name: 'Ana Costa', donations: 10, value: 2500 },
    { name: 'Pedro Lima', donations: 6, value: 1800 },
    { name: 'Carla Oliveira', donations: 7, value: 1600 },
  ]
};

export default function Analytics() {
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
          <h1 className="text-3xl font-bold tracking-tight">Analytics de Doações</h1>
          <p className="text-muted-foreground">
            Análises detalhadas e insights sobre as doações
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              +{mockAnalytics.overview.growthRate}% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockAnalytics.overview.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Valor estimado de todas as doações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doadores Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.totalDonors}</div>
            <p className="text-xs text-muted-foreground">
              Pessoas e organizações doadoras
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockAnalytics.overview.growthRate}%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de crescimento mensal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Doações</CardTitle>
            <CardDescription>
              Evolução das doações nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.trends.map((trend) => (
                <div key={trend.month} className="flex items-center justify-between">
                  <span className="font-medium">{trend.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {trend.donations} doações
                    </span>
                    <Badge variant="outline">
                      {formatCurrency(trend.value)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Donors */}
        <Card>
          <CardHeader>
            <CardTitle>Principais Doadores</CardTitle>
            <CardDescription>
              Doadores mais ativos do período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.topDonors.map((donor, index) => (
                <div key={donor.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{donor.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{donor.donations} doações</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(donor.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Categorias</CardTitle>
          <CardDescription>
            Distribuição das doações por tipo de item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {category.donations} doações
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exportar Relatórios</CardTitle>
            <CardDescription>
              Gere relatórios detalhados para análise externa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatório Mensal (PDF)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Planilha de Doações (Excel)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Lista de Doadores (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse outras funcionalidades rapidamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(ERoutes.DoacoesAdmin)}
              >
                <Package className="h-4 w-4 mr-2" />
                Administrar Doações
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(ERoutes.DoacoesCategorias)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Gerenciar Categorias
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(ERoutes.DoacoesCriar)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Nova Doação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
