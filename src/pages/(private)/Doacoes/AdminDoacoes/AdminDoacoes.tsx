import { useState } from 'react';
import { Loader2, Package } from 'lucide-react';
import { DonationFilters } from './_components/DonationFilters';
import { DonationCard } from './_components/DonationCard';
import { DonationFormDialog } from './_components/DonationFormDialog';
import { DistributionManagementDialog } from './_components/DistributionManagementDialogNew';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useGetDonations from './_hooks/useGetDonations';
import useCreateDonation from './_hooks/useCreateDonation';
import useUpdateDonation from './_hooks/useUpdateDonation';
import useDeleteDonation from './_hooks/useDeleteDonation';
import useUpdateDonationStatus from './_hooks/useUpdateDonationStatus';
import type { Donation, GetDonationsParams } from '../_types/Donation';
import type { DonationFormValues } from './_schemas/donationSchema';

export default function AdminDoacoes() {
  const [filters, setFilters] = useState<GetDonationsParams>({
    page: 1,
    limit: 12,
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDistributionOpen, setIsDistributionOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | undefined>();
  const [selectedDonation, setSelectedDonation] = useState<Donation | undefined>();

  const { data: donationsResponse, isLoading, error, refetch } = useGetDonations(filters);
  const createDonation = useCreateDonation();
  const updateDonation = useUpdateDonation(editingDonation?._id || '');
  const deleteDonation = useDeleteDonation();
  const updateStatus = useUpdateDonationStatus();

  const donations = Array.isArray(donationsResponse?.data?.data) ? donationsResponse.data.data : [];
  const totalPages = donationsResponse?.data?.totalPages || 1;
  const currentPage = donationsResponse?.data?.currentPage || 1;

  const handleCreateNew = () => {
    setEditingDonation(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: DonationFormValues) => {
    try {
      if (editingDonation) {
        await updateDonation.mutateAsync({ ...values });
      } else {
        await createDonation.mutateAsync(values);
      }
      setIsFormOpen(false);
      setEditingDonation(undefined);
      refetch();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (donationId: string) => {
    try {
      await deleteDonation.mutateAsync(donationId);
      refetch();
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
  };

  const handleStatusChange = async (donationId: string, status: 'pending' | 'received' | 'distributed') => {
    try {
      await updateStatus.mutateAsync({ id: donationId, status });
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleManageDistributions = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsDistributionOpen(true);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar doações</p>
            <Button onClick={() => refetch()} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 sm:p-6 border border-pink-100">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-pink-100 rounded-lg">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Administração de Doações
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Gerencie todas as doações recebidas e suas distribuições
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-pink-200">
            <span className="text-sm text-gray-500">Total de doações</span>
            <span className="text-lg sm:text-2xl font-bold text-gray-900">{donations.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 sm:p-6">
          <DonationFilters
            filters={filters}
            onFiltersChange={setFilters}
            onCreateNew={handleCreateNew}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Content */}
      {isLoading ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-pink-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Carregando doações...
                </h3>
                <p className="text-gray-500">
                  Aguarde enquanto buscamos os dados mais recentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : donations.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {filters.search || filters.status || filters.categoryId
                    ? 'Nenhuma doação encontrada'
                    : 'Nenhuma doação cadastrada ainda'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {filters.search || filters.status || filters.categoryId
                    ? 'Tente ajustar os filtros para encontrar o que procura ou adicione uma nova doação.'
                    : 'Comece adicionando a primeira doação para dar início ao seu trabalho de ajuda.'}
                </p>
                <Button onClick={handleCreateNew} size="lg" className="bg-pink-600 hover:bg-pink-700">
                  <Package className="h-5 w-5 mr-2" />
                  {filters.search || filters.status || filters.categoryId ? 'Nova Doação' : 'Criar Primeira Doação'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Results Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  Mostrando {donations.length} doações
                </span>
                {filters.search && (
                  <span className="text-xs sm:text-sm text-gray-500">
                    para "{filters.search}"
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </div>

          {/* Donations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {donations.map((donation) => (
              <div key={donation._id} className="min-w-0">
                <DonationCard
                  donation={donation}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                  onManageDistributions={handleManageDistributions}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4"
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="w-10 h-10 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4"
                  >
                    Próxima
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Form Dialog */}
      <DonationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        donation={editingDonation}
        onSubmit={handleFormSubmit}
        isLoading={createDonation.isPending || updateDonation.isPending}
      />

      {/* Distribution Management Dialog */}
      {selectedDonation && (
        <DistributionManagementDialog
          open={isDistributionOpen}
          onOpenChange={setIsDistributionOpen}
          donation={selectedDonation}
        />
      )}
    </div>
  );
}