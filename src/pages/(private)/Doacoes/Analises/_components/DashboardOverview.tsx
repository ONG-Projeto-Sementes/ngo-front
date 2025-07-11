import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, Users, Heart, BarChart3 } from 'lucide-react';

interface DashboardOverviewProps {
  data: {
    summary: {
      totalDonations: number;
      totalValue: number;
      totalQuantity: number;
      avgDonationValue: number;
      totalDonors: number;
    };
    recentActivity: Array<{
      _id: string;
      donorName: string;
      category: {
        categoryName: string;
        categoryIcon?: string;
        categoryColor?: string;
      };
      quantity: number;
      unit: string;
      estimatedValue?: number;
      status: string;
      receivedDate: string;
    }>;
    topDonors: Array<{
      name: string;
      totalDonations: number;
      totalValue: number;
      lastDonation: string;
    }>;
    statusBreakdown: Array<{
      status: string;
      count: number;
      totalValue: number;
      percentage: string;
    }>;
  };
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Métricas Principais */}
      <div className="lg:col-span-2 xl:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Doações</p>
                  <p className="text-xl font-bold text-gray-900">{data.summary.totalDonations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(data.summary.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Doadores</p>
                  <p className="text-xl font-bold text-gray-900">{data.summary.totalDonors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(data.summary.avgDonationValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Atividade Recente */}
      <Card className="lg:col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
          <CardDescription>Últimas doações recebidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(data.recentActivity) && data.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={activity._id || index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: activity.category?.categoryColor || '#6b7280' }}
                >
                  {activity.category?.categoryIcon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.donorName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.quantity} {activity.unit} • {activity.category?.categoryName}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(activity.status)}>
                    {getStatusLabel(activity.status)}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(activity.receivedDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Doadores */}
      <Card className="lg:col-span-1 xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Top Doadores</CardTitle>
          <CardDescription>Maiores contribuidores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(data.topDonors) && data.topDonors.slice(0, 5).map((donor, index) => (
              <div key={`${donor.name}-${index}`} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {donor.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {donor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {donor.totalDonations} doações • {formatCurrency(donor.totalValue)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">#{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
