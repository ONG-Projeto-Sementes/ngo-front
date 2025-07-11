import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import useCreateDonation from '../_hooks/useCreateDonation';
import { useDonationCategories } from '../_hooks/useDonationCategories';
import { donationSchema } from '../_schemas/donation.schema';
import type { DonationFormData } from '../_types/Donation';
import type { DonationCategory } from '../_types/DonationCategory';

export default function CriarDoacao() {
  const navigate = useNavigate();
  const { data: categories } = useDonationCategories();
  const createMutation = useCreateDonation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      status: 'pending',
      receivedDate: new Date().toISOString().split('T')[0],
    },
  });

  const watchedCategoryId = watch('categoryId');

  const onSubmit = async (data: DonationFormData) => {
    try {
      await createMutation.mutateAsync(data);
      navigate('/doacoes');
    } catch (error) {
      console.error('Error creating donation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/doacoes')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Doação</h1>
          <p className="text-muted-foreground">
            Registre uma nova doação recebida pela organização
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Doação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="donorName">Nome do Doador *</Label>
                <Input
                  id="donorName"
                  {...register('donorName')}
                  placeholder="Nome completo do doador"
                />
                {errors.donorName && (
                  <p className="text-sm text-destructive">{errors.donorName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorContact">Contato do Doador *</Label>
                <Input
                  id="donorContact"
                  {...register('donorContact')}
                  placeholder="Telefone ou email"
                />
                {errors.donorContact && (
                  <p className="text-sm text-destructive">{errors.donorContact.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoria *</Label>
                <Select 
                  value={watchedCategoryId} 
                  onValueChange={(value) => setValue('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.filter((cat: DonationCategory) => cat.isActive).map((category: DonationCategory) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  defaultValue="pending"
                  onValueChange={(value) => setValue('status', value as 'pending' | 'received' | 'distributed')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="received">Recebida</SelectItem>
                    <SelectItem value="distributed">Distribuída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  {...register('quantity', { valueAsNumber: true })}
                  placeholder="Quantidade recebida"
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade *</Label>
                <Input
                  id="unit"
                  {...register('unit')}
                  placeholder="kg, unidades, caixas..."
                />
                {errors.unit && (
                  <p className="text-sm text-destructive">{errors.unit.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Valor Estimado *</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  step="0.01"
                  {...register('estimatedValue', { valueAsNumber: true })}
                  placeholder="Valor em reais"
                />
                {errors.estimatedValue && (
                  <p className="text-sm text-destructive">{errors.estimatedValue.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="receivedDate">Data de Recebimento *</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  {...register('receivedDate')}
                />
                {errors.receivedDate && (
                  <p className="text-sm text-destructive">{errors.receivedDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva a doação recebida..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Observações adicionais (opcional)"
                rows={2}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/doacoes')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || createMutation.isPending}
                className="min-w-[120px]"
              >
                {isSubmitting || createMutation.isPending ? (
                  'Salvando...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
