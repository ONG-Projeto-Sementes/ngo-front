import { useState } from 'react';
import { RefreshCw, Calendar, TrendingUp, Users, Package, Heart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboardOverview } from '../_hooks/useDashboardOverview';

const periodOptions = [
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mês' },
  { value: 'quarter', label: 'Este Trimestre' },
  { value: 'year', label: 'Este Ano' },
  { value: 'all', label: 'Todo o Período' },
];

export default function Analises() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  
  const { 
    data: dashboard, 
    isLoading: isDashboardLoading, 
    error: dashboardError,
    refetch: refetchDashboard 
  } = useDashboardOverview({ period });

  const handleRefresh = () => {
    refetchDashboard();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'distributed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'received': return 'Recebida';
      case 'pending': return 'Pendente';
      case 'distributed': return 'Distribuída';
      case 'expired': return 'Expirada';
      default: return status;
    }
  };

  if (dashboardError) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar dados de análise</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Análises e Métricas</h2>
          <p className="text-sm sm:text-base text-gray-600">Insights detalhados sobre doações e impacto social</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Select value={period} onValueChange={(value: 'week' | 'month' | 'quarter' | 'year' | 'all') => setPeriod(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="flex-shrink-0">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Atualizar</span>
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total de Doações</p>
                {isDashboardLoading ? (
                  <Skeleton className="h-6 sm:h-7 lg:h-8 w-12 sm:w-14 lg:w-16 mb-1" />
                ) : (
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {dashboard?.summary?.totalDonations || 0}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                  <span className="text-xs sm:text-sm text-green-600 truncate">vs período anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Valor Total</p>
                {isDashboardLoading ? (
                  <Skeleton className="h-6 sm:h-7 lg:h-8 w-16 sm:w-18 lg:w-20 mb-1" />
                ) : (
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    {formatCurrency(dashboard?.summary?.totalValue || 0)}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1" />
                  <span className="text-xs sm:text-sm text-blue-600 truncate">vs período anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Doadores Únicos</p>
                {isDashboardLoading ? (
                  <Skeleton className="h-6 sm:h-7 lg:h-8 w-12 sm:w-14 lg:w-16 mb-1" />
                ) : (
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {dashboard?.summary?.totalDonors || 0}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-1" />
                  <span className="text-xs sm:text-sm text-purple-600 truncate">vs período anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Valor Médio</p>
                {isDashboardLoading ? (
                  <Skeleton className="h-6 sm:h-7 lg:h-8 w-16 sm:w-18 lg:w-20 mb-1" />
                ) : (
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    {formatCurrency(dashboard?.summary?.avgDonationValue || 0)}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 mr-1" />
                  <span className="text-xs sm:text-sm text-orange-600 truncate">vs período anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout de Duas Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Atividade Recente */}
        <Card className="border-0 shadow-md">
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
              Atividade Recente
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Últimas doações recebidas no sistema</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            {isDashboardLoading ? (
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 sm:space-x-3">
                    <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-1 sm:mb-2" />
                      <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                    </div>
                    <Skeleton className="h-5 sm:h-6 w-12 sm:w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {Array.isArray(dashboard?.recentActivity) && dashboard.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={activity._id || index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0"
                      style={{ backgroundColor: activity.category?.categoryColor || '#6b7280' }}
                    >
                      {activity.category?.categoryIcon || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {activity.donorName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {activity.quantity} {activity.unit} • {activity.category?.categoryName}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge className={`${getStatusColor(activity.status)} text-xs`}>
                        {getStatusLabel(activity.status)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                        {formatDate(activity.receivedDate)}
                      </p>
                    </div>
                  </div>
                ))}
                {(!dashboard?.recentActivity || dashboard.recentActivity.length === 0) && (
                  <div className="text-center py-6 sm:py-8">
                    <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500">Nenhuma atividade recente encontrada</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Doadores */}
        <Card className="border-0 shadow-md">
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Top Doadores
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Maiores contribuidores do período</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            {isDashboardLoading ? (
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 sm:space-x-3">
                    <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-1 sm:mb-2" />
                      <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                    </div>
                    <Skeleton className="h-3 sm:h-4 w-6 sm:w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {Array.isArray(dashboard?.topDonors) && dashboard.topDonors.slice(0, 5).map((donor, index) => (
                  <div key={`${donor.name}-${index}`} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                      {donor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {donor.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {donor.totalDonations} doações • {formatCurrency(donor.totalValue)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!dashboard?.topDonors || dashboard.topDonors.length === 0) && (
                  <div className="text-center py-6 sm:py-8">
                    <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500">Nenhum doador encontrado</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Breakdown por Status e Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Status Breakdown */}
        <Card className="border-0 shadow-md">
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
              Distribuição por Status
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Situação atual das doações</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            {isDashboardLoading ? (
              <div className="space-y-2 sm:space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {Array.isArray(dashboard?.statusBreakdown) && dashboard.statusBreakdown.map((status, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <Badge className={`${getStatusColor(status.status)} text-xs flex-shrink-0`}>
                        {getStatusLabel(status.status)}
                      </Badge>
                      <span className="text-xs sm:text-sm text-gray-600 truncate">{status.count} doações</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:text-right gap-3 sm:gap-0 sm:flex-col sm:items-end flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium">{status.percentage}</span>
                      <p className="text-xs text-gray-500">{formatCurrency(status.totalValue)}</p>
                    </div>
                  </div>
                ))}
                {(!dashboard?.statusBreakdown || dashboard.statusBreakdown.length === 0) && (
                  <div className="text-center py-6 sm:py-8">
                    <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500">Nenhum dado de status encontrado</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-0 shadow-md">
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
              Distribuição por Categoria
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Doações organizadas por categoria</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            {isDashboardLoading ? (
              <div className="space-y-2 sm:space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg" />
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                    </div>
                    <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {Array.isArray(dashboard?.categoryBreakdown) && dashboard.categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div 
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0"
                        style={{ backgroundColor: category.categoryColor || '#6b7280' }}
                      >
                        {category.categoryIcon || '📦'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{category.categoryName}</p>
                        <p className="text-xs text-gray-500">{category.count} doações</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium">{category.percentage}</span>
                      <p className="text-xs text-gray-500">{formatCurrency(category.totalValue)}</p>
                    </div>
                  </div>
                ))}
                {(!dashboard?.categoryBreakdown || dashboard.categoryBreakdown.length === 0) && (
                  <div className="text-center py-6 sm:py-8">
                    <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500">Nenhuma categoria encontrada</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}