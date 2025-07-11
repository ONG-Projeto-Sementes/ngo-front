import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ERoutes } from '@/types/ERoutes';
import AdminDoacoes from './AdminDoacoes/AdminDoacoes';
import Analises from './Analises/Analises';
import { useDashboardOverview } from './_hooks/useDashboardOverview';
import { Package, BarChart3, Settings, ArrowRight, Heart, TrendingUp, TrendingDown, Users } from 'lucide-react';

export default function Doacoes() {
  const [activeTab, setActiveTab] = useState('admin');
  const navigate = useNavigate();

  // Buscar dados do dashboard
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardOverview({
    period: 'month',
  });

  const handleNavigateToCategories = () => {
    navigate('/doacoes/categorias');
  };

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatGrowthPercentage = (growth: number | undefined) => {
    if (growth === undefined || growth === 0) return { text: 'sem alteração', icon: 'neutral', color: 'text-gray-500' };

    const isPositive = growth > 0;
    const text = `${isPositive ? '+' : ''}${growth}% este mês`;
    const icon = isPositive ? 'up' : 'down';
    const color = isPositive ? 'text-green-600' : 'text-red-600';

    return { text, icon, color };
  };

  return (
    <div className="min-h-screen transition-all duration-300">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-in fade-in-50 duration-700">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8 animate-in slide-in-from-top-3 duration-500">
          <Header title="Sistema de Gestão de Doações" />
          <Breadcrumbs
            routes={[
              { label: 'Início', to: ERoutes.Inicio },
              { label: 'Doações', to: ERoutes.Doacoes },
            ]}
          />
        </div>

        {/* Welcome Card */}
        <Card className="mb-4 sm:mb-6 lg:mb-8 border-0 shadow-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-in slide-in-from-left-5 duration-500 delay-100">
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-3 sm:pb-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3 group">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 transition-all duration-300 group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight transition-all duration-300">
                    Gestão Inteligente de Doações
                  </CardTitle>
                  <CardDescription className="text-pink-100 text-sm sm:text-base lg:text-lg mt-1 transition-all duration-300">
                    Gerencie doações, categorias e análises em um só lugar
                  </CardDescription>
                </div>
              </div>
              <div className="flex justify-start">
                <Button
                  onClick={handleNavigateToCategories}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 transition-transform duration-300 group-hover:rotate-90" />
                  <span className="hidden xs:inline">Gerenciar </span>Categorias
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6 sm:mb-8">
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-500 ease-out transform hover:scale-[1.03] hover:-translate-y-2 group animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-pink-100 rounded-lg flex-shrink-0 transition-all duration-300 group-hover:bg-pink-200 group-hover:scale-110">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-pink-600 transition-all duration-300 group-hover:text-pink-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate transition-colors duration-300 group-hover:text-gray-700">Total de Doações</p>
                  {dashboardLoading ? (
                    <Skeleton className="h-5 sm:h-6 lg:h-8 w-10 sm:w-12 lg:w-16 mb-1" />
                  ) : (
                    <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:text-pink-600">{dashboardData?.summary?.totalDonations || 0}</p>
                  )}
                  <div className="flex items-center mt-1">
                    {dashboardLoading ? (
                      <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 lg:w-20" />
                    ) : (
                      <>
                        {(() => {
                          const growth = formatGrowthPercentage(dashboardData?.summary?.donationsGrowth);
                          const IconComponent =
                            growth.icon === 'up' ? TrendingUp : growth.icon === 'down' ? TrendingDown : TrendingUp;
                          return (
                            <>
                              <IconComponent
                                className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 transition-all duration-300 ${growth.icon === 'up' ? 'text-pink-500 group-hover:text-pink-600' : growth.icon === 'down' ? 'text-red-500 group-hover:text-red-600' : 'text-gray-500 group-hover:text-gray-600'} ${growth.icon === 'up' ? 'group-hover:translate-y-[-2px]' : growth.icon === 'down' ? 'group-hover:translate-y-[2px]' : ''}`}
                              />
                              <span className={`text-xs sm:text-sm ${growth.color} truncate transition-colors duration-300`}>{growth.text}</span>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-500 ease-out transform hover:scale-[1.03] hover:-translate-y-2 group animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0 transition-all duration-300 group-hover:bg-purple-200 group-hover:scale-110">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 transition-all duration-300 group-hover:text-purple-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate transition-colors duration-300 group-hover:text-gray-700">Valor Total</p>
                  {dashboardLoading ? (
                    <Skeleton className="h-5 sm:h-6 lg:h-8 w-12 sm:w-16 lg:w-20 mb-1" />
                  ) : (
                    <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 truncate transition-all duration-300 group-hover:text-purple-600">
                      {formatCurrency(dashboardData?.summary?.totalValue || 0)}
                    </p>
                  )}
                  <div className="flex items-center mt-1">
                    {dashboardLoading ? (
                      <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 lg:w-20" />
                    ) : (
                      <>
                        {(() => {
                          const growth = formatGrowthPercentage(dashboardData?.summary?.valueGrowth);
                          const IconComponent =
                            growth.icon === 'up' ? TrendingUp : growth.icon === 'down' ? TrendingDown : TrendingUp;
                          return (
                            <>
                              <IconComponent
                                className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 transition-all duration-300 ${growth.icon === 'up' ? 'text-purple-500 group-hover:text-purple-600' : growth.icon === 'down' ? 'text-red-500 group-hover:text-red-600' : 'text-gray-500 group-hover:text-gray-600'} ${growth.icon === 'up' ? 'group-hover:translate-y-[-2px]' : growth.icon === 'down' ? 'group-hover:translate-y-[2px]' : ''}`}
                              />
                              <span className={`text-xs sm:text-sm ${growth.color} truncate transition-colors duration-300`}>{growth.text}</span>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-500 ease-out transform hover:scale-[1.03] hover:-translate-y-2 group animate-in slide-in-from-bottom-4 duration-500 delay-500">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-rose-100 rounded-lg flex-shrink-0 transition-all duration-300 group-hover:bg-rose-200 group-hover:scale-110">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-rose-600 transition-all duration-300 group-hover:text-rose-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate transition-colors duration-300 group-hover:text-gray-700">Doadores Únicos</p>
                  {dashboardLoading ? (
                    <Skeleton className="h-5 sm:h-6 lg:h-8 w-10 sm:w-12 lg:w-16 mb-1" />
                  ) : (
                    <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:text-rose-600">{dashboardData?.summary?.totalDonors || 0}</p>
                  )}
                  <div className="flex items-center mt-1">
                    {dashboardLoading ? (
                      <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 lg:w-20" />
                    ) : (
                      <>
                        {(() => {
                          const growth = formatGrowthPercentage(dashboardData?.summary?.donorsGrowth);
                          const IconComponent =
                            growth.icon === 'up' ? TrendingUp : growth.icon === 'down' ? TrendingDown : TrendingUp;
                          return (
                            <>
                              <IconComponent
                                className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 transition-all duration-300 ${growth.icon === 'up' ? 'text-rose-500 group-hover:text-rose-600' : growth.icon === 'down' ? 'text-red-500 group-hover:text-red-600' : 'text-gray-500 group-hover:text-gray-600'} ${growth.icon === 'up' ? 'group-hover:translate-y-[-2px]' : growth.icon === 'down' ? 'group-hover:translate-y-[2px]' : ''}`}
                              />
                              <span className={`text-xs sm:text-sm ${growth.color} truncate transition-colors duration-300`}>{growth.text}</span>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="border-0 shadow-lg transition-all duration-500 hover:shadow-xl animate-in slide-in-from-bottom-5 duration-600 delay-700">
          <CardHeader className="border-b bg-gray-50/50 p-3 sm:p-4 lg:p-6 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4">
              <div>
                <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 transition-colors duration-300">Área de Trabalho</CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base transition-colors duration-300">
                  Administre doações ou visualize análises
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-xs transition-all duration-300 hover:bg-pink-200 hover:scale-105 animate-pulse">
                Sistema Ativo
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-4 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 lg:mb-6 h-9 sm:h-10 lg:h-12 bg-gray-100 transition-all duration-300">
                <TabsTrigger
                  value="admin"
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm px-1 sm:px-2 transition-all duration-300 ease-out data-[state=active]:scale-[1.02] hover:bg-gray-50 group"
                >
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden min-[400px]:inline transition-opacity duration-300">Administração</span>
                  <span className="min-[400px]:hidden transition-opacity duration-300">Admin</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm px-1 sm:px-2 transition-all duration-300 ease-out data-[state=active]:scale-[1.02] hover:bg-gray-50 group"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden min-[400px]:inline transition-opacity duration-300">Análises</span>
                  <span className="min-[400px]:hidden transition-opacity duration-300">Dados</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 lg:mt-6 animate-in fade-in-50 duration-500">
                <AdminDoacoes />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 lg:mt-6 animate-in fade-in-50 duration-500">
                <Analises />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
