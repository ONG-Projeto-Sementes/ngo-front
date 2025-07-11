import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { donationSchema, type DonationFormValues } from '../Lista/_schemas/donationSchema';
import { useDonationCategories } from '../Categorias/_hooks/useDonationCategories';
import { useCreateDonation } from '../Lista/_hooks/useCreateDonation';
import { useUpdateDonation } from '../Lista/_hooks/useUpdateDonation';
import { useDonationById } from '../Lista/_hooks/useDonationById';
import { ERoutes } from '@/types/ERoutes';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function CriarEditarDoacao() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donorName: '',
      donorContact: '',
      categoryId: '',
      quantity: 0,
      unit: '',
      description: '',
      estimatedValue: 0,
      receivedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: '',
    },
  });

  const { data: categoriesResponse } = useDonationCategories({
    limit: 100,
  });

  const { data: donation } = useDonationById(id || '', isEditing);

  const createMutation = useCreateDonation();
  const updateMutation = useUpdateDonation();

  // Load donation data if editing
  useEffect(() => {
    if (isEditing && donation) {
      form.reset({
        donorName: donation.donorName,
        donorContact: donation.donorContact,
        categoryId: donation.categoryId,
        quantity: donation.quantity,
        unit: donation.unit,
        description: donation.description,
        estimatedValue: donation.estimatedValue,
        receivedDate: donation.receivedDate,
        status: donation.status,
        notes: donation.notes || '',
      });
    }
  }, [isEditing, donation, form]);

  const onSubmit = (data: DonationFormValues) => {
    if (isEditing && id) {
      updateMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            toast.success('Doação atualizada com sucesso!');
            navigate(ERoutes.DoacoesLista);
          },
          onError: () => {
            toast.error('Erro ao atualizar doação');
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Doação criada com sucesso!');
          navigate(ERoutes.DoacoesLista);
        },
        onError: () => {
          toast.error('Erro ao criar doação');
        },
      });
    }
  };

  const handleBack = () => {
    navigate(ERoutes.DoacoesLista);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista
        </Button>
        
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar Doação' : 'Nova Doação'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Atualize as informações da doação' : 'Registre uma nova doação recebida'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Doação</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Informações do Doador */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações do Doador</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="donorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Doador</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="donorContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contato</FormLabel>
                        <FormControl>
                          <Input placeholder="Telefone ou email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Informações da Doação */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detalhes da Doação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoriesResponse?.data?.map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
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
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade</FormLabel>
                        <FormControl>
                          <Input placeholder="kg, unidade, litro..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva a doação..."
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="estimatedValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Estimado (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0,00" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receivedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Recebimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="received">Recebida</SelectItem>
                            <SelectItem value="distributed">Distribuída</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Observações (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações adicionais..."
                          className="resize-none"
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? 'Atualizar' : 'Criar'} Doação
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
