import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package,
  Trash2,
  Plus
} from 'lucide-react';
import { donationDistributionSchema, type DonationDistributionFormValues } from '../_schemas/donationDistributionSchema';
import useGetDonationDistributions from '../_hooks/useGetDonationDistributions';
import useCreateDonationDistribution from '../_hooks/useCreateDonationDistribution';
import useGetFamilies from '@/pages/(private)/Familias/_hooks/useGetFamilies';
import useGetFamilyById from '@/pages/(private)/Familias/_hooks/useGetFamilyById';
import useDeleteDonationDistribution from '../_hooks/useDeleteDonationDistribution';
import type { Donation, DonationDistribution } from '../../_types/Donation';
import type { FamilyDTO } from '@/services/families/getFamilies';

interface DistributionManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: Donation;
}

// Componente para exibir o nome da família
function FamilyDisplay({ familyId }: { familyId: string }) {
  const { data: family, isLoading } = useGetFamilyById(familyId);
  
  if (isLoading) {
    return <span className="animate-pulse">Carregando...</span>;
  }
  
  if (!family) {
    return <span className="text-red-500">Família não encontrada</span>;
  }
  
  return (
    <div>
      <p className="font-medium text-gray-900">{family.name}</p>
      <p className="text-sm text-gray-500">
        {family.neighborhood}, {family.city}
      </p>
    </div>
  );
}

export function DistributionManagementDialog({
  open,
  onOpenChange,
  donation,
}: DistributionManagementDialogProps) {
  const [showForm, setShowForm] = useState(false);
  
  const { data: distributions, refetch: refetchDistributions } = useGetDonationDistributions(donation._id);
  const { data: familiesResponse } = useGetFamilies(1, "");
  const families = Array.isArray(familiesResponse?.data) ? familiesResponse.data : [];
  
  const createDistribution = useCreateDonationDistribution();
  const deleteDistribution = useDeleteDonationDistribution();

  const form = useForm<DonationDistributionFormValues>({
    resolver: zodResolver(donationDistributionSchema),
    defaultValues: {
      donationId: donation._id,
      familyId: '',
      quantity: 1,
      notes: '',
    },
  });

  const handleSubmit = async (values: DonationDistributionFormValues) => {
    try {
      await createDistribution.mutateAsync(values);
      form.reset({
        donationId: donation._id,
        familyId: '',
        quantity: 1,
        notes: '',
      });
      setShowForm(false);
      refetchDistributions();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleDelete = async (distributionId: string) => {
    try {
      await deleteDistribution.mutateAsync(distributionId);
      refetchDistributions();
    } catch {
      // Error is handled by the hook
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalDistributed = distributions?.reduce((sum: number, dist: DonationDistribution) => sum + dist.quantity, 0) || 0;
  const availableQuantity = donation.quantity - totalDistributed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
          <DialogTitle className="flex items-center space-x-3 text-lg sm:text-xl">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
            <span className="truncate">Gerenciar Distribuições - {donation.donorName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Donation Summary */}
            <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg text-pink-900">Resumo da Doação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-pink-700">Quantidade Total</p>
                    <p className="text-lg sm:text-xl font-bold text-pink-900">{donation.quantity} {donation.unit}</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-pink-700">Distribuído</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">{totalDistributed} {donation.unit}</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-pink-700">Disponível</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">{availableQuantity} {donation.unit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add New Distribution */}
            <Card className="border-pink-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base sm:text-lg text-pink-900 flex items-center space-x-2">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Nova Distribuição</span>
                </CardTitle>
                <Button
                  onClick={() => setShowForm(!showForm)}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  {showForm ? 'Cancelar' : 'Adicionar Distribuição'}
                </Button>
              </CardHeader>
              
              {showForm && (
                <CardContent className="pt-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="familyId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Família</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="text-sm">
                                    <SelectValue placeholder="Selecione uma família" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {families.length === 0 ? (
                                    <div className="p-2 text-center text-sm text-gray-500">
                                      Nenhuma família encontrada
                                    </div>
                                  ) : (
                                    families.map((family: FamilyDTO) => (
                                      <SelectItem key={family._id} value={family._id}>
                                        <div>
                                          <div className="font-medium">{family.name}</div>
                                          <div className="text-xs text-gray-500">{family.neighborhood}, {family.city}</div>
                                        </div>
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Quantidade</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max={availableQuantity}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Observações (opcional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Adicione observações sobre esta distribuição..."
                                {...field}
                                className="text-sm resize-none"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowForm(false)}
                          size="sm"
                          className="text-sm"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={createDistribution.isPending || availableQuantity <= 0}
                          size="sm"
                          className="bg-pink-600 hover:bg-pink-700 text-sm"
                        >
                          {createDistribution.isPending ? 'Salvando...' : 'Salvar Distribuição'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              )}
            </Card>

            {/* Existing Distributions */}
            <Card className="border-pink-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg text-pink-900 flex items-center space-x-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Distribuições Realizadas</span>
                  {distributions && distributions.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-pink-100 text-pink-800">
                      {distributions.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!distributions || distributions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">Nenhuma distribuição realizada ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {distributions.map((distribution: DonationDistribution) => (
                      <div
                        key={distribution._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="flex-1 min-w-0">
                              <FamilyDisplay familyId={distribution.familyId} />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{distribution.quantity} {donation.unit}</span>
                              </div>
                              <div className="text-gray-500">
                                {formatDate(distribution.distributionDate)}
                              </div>
                            </div>
                          </div>
                          {distribution.notes && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                              {distribution.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(distribution._id)}
                          disabled={deleteDistribution.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1 hidden sm:inline">Remover</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
