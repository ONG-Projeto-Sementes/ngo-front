import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, Calendar, MapPin, Phone, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  donationDistributionSchema,
  type DonationDistributionFormValues,
} from '../_schemas/donationDistributionSchema';
import useGetDonationDistributions from '../_hooks/useGetDonationDistributions';
import useCreateDonationDistribution from '../_hooks/useCreateDonationDistribution';
import { FamilySelectionModal } from './FamilySelectionModal';
import type { Donation } from '../../_types/Donation';
import type { FamilyDTO } from '@/services/families/getFamilies';

interface DistributionManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: Donation;
}

export function DistributionManagementDialog({ open, onOpenChange, donation }: DistributionManagementDialogProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<FamilyDTO | null>(null);
  const [showFamilyModal, setShowFamilyModal] = useState(false);

  const {
    data: distributions,
    refetch: refetchDistributions,
    isLoading: distributionsLoading,
  } = useGetDonationDistributions(donation._id);
  const createDistribution = useCreateDonationDistribution();

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
    if (!selectedFamily) {
      toast.error('Por favor, selecione uma família para a distribuição');
      return;
    }

    const payload = {
      ...values,
      familyId: selectedFamily._id,
    };

    console.log('Payload enviado:', payload);
    console.log('Donation ID:', donation._id);
    console.log('Family ID:', selectedFamily._id);

    try {
      await createDistribution.mutateAsync(payload);

      // Reset form and state
      form.reset({
        donationId: donation._id,
        familyId: '',
        quantity: 1,
        notes: '',
      });
      setSelectedFamily(null);
      setShowForm(false);
      refetchDistributions();
      toast.success('Distribuição criada com sucesso!');
    } catch (error) {
      console.error('Error creating distribution:', error);
      toast.error('Erro ao criar distribuição. Verifique os dados e tente novamente.');
    }
  };

  const handleSelectFamily = (family: FamilyDTO) => {
    setSelectedFamily(family);
    form.setValue('familyId', family._id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalDistributed = Array.isArray(distributions)
    ? distributions.reduce((sum, dist) => sum + dist.quantity, 0)
    : 0;
  const availableQuantity = donation.quantity - totalDistributed;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Gerenciar Distribuições - {donation.donorName}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Donation Summary */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span>Resumo da Doação</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Quantidade Total</p>
                    <p className="text-xl font-bold text-gray-900">{donation.quantity}</p>
                    <p className="text-xs text-gray-500">{donation.unit}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Distribuído</p>
                    <p className="text-xl font-bold text-blue-700">{totalDistributed}</p>
                    <p className="text-xs text-blue-500">{donation.unit}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-600">Disponível</p>
                    <p className="text-xl font-bold text-green-700">{availableQuantity}</p>
                    <p className="text-xs text-green-500">{donation.unit}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-600">Categoria</p>
                    <p className="text-sm font-bold text-purple-700">{donation.category?.name || 'N/A'}</p>
                    <p className="text-xs text-purple-500">Status: {donation.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add New Distribution */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Nova Distribuição</span>
                  </CardTitle>
                  <Button
                    onClick={() => setShowForm(!showForm)}
                    disabled={availableQuantity <= 0}
                    variant={showForm ? 'outline' : 'default'}
                  >
                    {showForm ? 'Cancelar' : 'Adicionar Distribuição'}
                  </Button>
                </div>
                {availableQuantity <= 0 && (
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-700">Toda a quantidade desta doação já foi distribuída.</p>
                  </div>
                )}
              </CardHeader>

              {showForm && (
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      {/* Family Selection */}
                      <div className="space-y-4">
                        <FormLabel>Família Beneficiária</FormLabel>
                        {selectedFamily ? (
                          <Card className="border-green-200 bg-green-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {selectedFamily.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-green-900">{selectedFamily.name}</p>
                                    <div className="flex items-center space-x-4 text-sm text-green-700">
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>
                                          {selectedFamily.city}, {selectedFamily.neighborhood}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Phone className="h-3 w-3" />
                                        <span>{selectedFamily.contact}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowFamilyModal(true)}
                                >
                                  Alterar Família
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-16 border-dashed border-2 border-gray-300 hover:border-gray-400"
                            onClick={() => setShowFamilyModal(true)}
                          >
                            <div className="flex flex-col items-center space-y-1">
                              <Users className="h-5 w-5 text-gray-400" />
                              <span className="text-sm text-gray-600">Clique para selecionar uma família</span>
                            </div>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Quantidade (máx: {availableQuantity} {donation.unit})
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  max={availableQuantity}
                                  placeholder="Ex: 5"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-end">
                          <div className="w-full p-3 bg-gray-50 border rounded-md">
                            <p className="text-sm font-medium text-gray-600">Unidade</p>
                            <p className="text-lg font-semibold text-gray-900">{donation.unit}</p>
                          </div>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações (opcional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Informações adicionais sobre a distribuição..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createDistribution.isPending || !selectedFamily}>
                          {createDistribution.isPending ? 'Criando...' : 'Criar Distribuição'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              )}
            </Card>

            {/* Existing Distributions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-xs sm:text-auto">Distribuições Realizadas</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchDistributions()}
                    disabled={distributionsLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${distributionsLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {distributionsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !distributions || distributions.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Nenhuma distribuição realizada ainda.</p>
                    <p className="text-sm text-gray-400 mt-1">As distribuições aparecerão aqui após serem criadas.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {distributions.map((distribution) => (
                      <div
                        key={distribution._id}
                        className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {distribution.family?.name?.charAt(0)?.toUpperCase() || 'F'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {distribution.family?.name || 'Família não encontrada'}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">
                                  {distribution.family?.city || 'N/A'}, {distribution.family?.neighborhood || 'N/A'}
                                </span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(distribution.distributionDate)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Distribution Info */}
                        <div className="flex flex-col items-end gap-1 min-w-[120px]">
                          <Badge variant="secondary" className="text-base px-3 py-1 rounded-lg">
                            {distribution.quantity} {donation.unit}
                          </Badge>
                          {distribution.notes && (
                            <p className="text-xs text-gray-500 max-w-full sm:max-w-[200px] truncate text-right italic">
                              {distribution.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Family Selection Modal */}
      <FamilySelectionModal
        open={showFamilyModal}
        onOpenChange={setShowFamilyModal}
        onSelectFamily={handleSelectFamily}
        selectedFamilyId={selectedFamily?._id}
      />
    </>
  );
}
