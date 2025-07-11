import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { useDonationStats } from './_hooks/useDonationStats';
import { useDonationStatsByCategory } from './_hooks/useDonationStatsByCategory';

export default function EstatisticasDoacoes() {
  const { data: stats, isLoading: statsLoading } = useDonationStats();
  const { data: categoryStats, isLoading: categoryStatsLoading } = useDonationStatsByCategory();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const isLoading = statsLoading || categoryStatsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Estatísticas de Doações</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho e impacto das doações
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Estatísticas de Doações</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho e impacto das doações
        </p>
      </div>

      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Doações</p>
                <p className="text-2xl font-bold">{formatNumber(stats?.totalDonations || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Doadores</p>
                <p className="text-2xl font-bold">{formatNumber(stats?.totalDonors || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.totalValue || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Distribuídas</p>
                <p className="text-2xl font-bold">{formatNumber(stats?.distributedDonations || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas por Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Doações por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Pendentes</Badge>
                </div>
                <span className="font-semibold">{formatNumber(stats?.pendingDonations || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Recebidas</Badge>
                </div>
                <span className="font-semibold">{formatNumber(stats?.receivedDonations || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Distribuídas</Badge>
                </div>
                <span className="font-semibold">{formatNumber(stats?.distributedDonations || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pendentes</span>
                <span className="font-semibold">{formatCurrency(stats?.pendingValue || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recebidas</span>
                <span className="font-semibold">{formatCurrency(stats?.receivedValue || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Distribuídas</span>
                <span className="font-semibold">{formatCurrency(stats?.distributedValue || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Doações por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryStats?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryStats.map((category) => (
                <div
                  key={category.categoryId}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {category.categoryInfo?.icon && (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: category.categoryInfo.color || '#6b7280' }}
                      >
                        <span className="text-lg">{category.categoryInfo.icon}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{category.categoryInfo?.name || 'Categoria'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.totalDonations} doações
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor total:</span>
                      <span className="font-medium">{formatCurrency(category.totalValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <span className="font-medium">
                        {formatNumber(category.totalQuantity)} {category.categoryInfo?.defaultUnit || ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma doação registrada ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
