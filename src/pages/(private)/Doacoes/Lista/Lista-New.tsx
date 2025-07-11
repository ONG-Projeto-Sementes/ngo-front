import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useDonations } from '../_hooks/useDonations';
import { useDonationCategories } from '../_hooks/useDonationCategories';
import { useUpdateDonationStatus } from '../_hooks/useUpdateDonationStatus';
import { DonationFilters } from './_components/DonationFilters';
import { DonationCard } from './_components/DonationCard';
import { DonationViewToggle } from './_components/DonationViewToggle';
import type { Donation } from '../_types/Donation';
import type { GetDonationsParams } from '@/services/donations/getDonations';

export default function DonationsList() {
  const [filters, setFilters] = useState<GetDonationsParams>({
    page: 1,
    limit: 10,
  });
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { data: donationsData, isLoading } = useDonations(filters);
  const { data: categories } = useDonationCategories();
  const updateStatusMutation = useUpdateDonationStatus();

  const handleEditDonation = (donation: Donation) => {
    // TODO: Navigate to edit page
    console.log('Edit donation:', donation);
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'received' | 'distributed') => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  const handleNewDonation = () => {
    // TODO: Navigate to create page
    console.log('New donation');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const donations = donationsData?.donations || [];
  const stats = donationsData?.statistics;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as doações recebidas pela organização
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
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
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(stats.totalValue)}
              </div>
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(stats.pendingValue || 0)}
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(stats.distributedValue || 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <DonationFilters
        categories={categories || []}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* View Toggle and Actions */}
      <DonationViewToggle 
        view={view}
        onViewChange={setView}
        onNewDonation={handleNewDonation}
      />

      {/* Donations List */}
      <div className={`
        ${view === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
          : 'space-y-4'
        }
      `}>
        {donations.map((donation) => {
          const category = categories?.find(cat => cat._id === donation.categoryId);
          
          return (
            <DonationCard
              key={donation._id}
              donation={donation}
              category={category}
              onEdit={handleEditDonation}
              onStatusChange={handleStatusChange}
            />
          );
        })}
      </div>

      {donations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Nenhuma doação encontrada</CardTitle>
            <CardDescription className="text-center mb-4">
              Não há doações cadastradas com os filtros selecionados.
              <br />
              Comece adicionando uma nova doação.
            </CardDescription>
            <Button onClick={handleNewDonation}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Doação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
