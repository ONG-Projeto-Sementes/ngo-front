import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { donationSchema, type DonationFormValues } from '../_schemas/donationSchema';
import { useDonationCategories } from '../../Categorias/_hooks/useDonationCategories';
import type { Donation } from '../../_types/Donation';
import type { DonationCategory } from '../../_types/DonationCategory';

interface DonationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation?: Donation;
  onSubmit: (data: DonationFormValues) => void;
  isLoading?: boolean;
}

export function DonationFormDialog({
  open,
  onOpenChange,
  donation,
  onSubmit,
  isLoading = false,
}: DonationFormDialogProps) {
  const { data: categoriesResponse } = useDonationCategories();
  const categories = Array.isArray(categoriesResponse?.data?.data) ? categoriesResponse.data.data : [];

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      categoryId: '',
      donorName: '',
      donorContact: '',
      quantity: 1,
      estimatedValue: 0,
      unit: '',
      description: '',
      receivedDate: new Date().toISOString().split('T')[0],
    },
  });

  // Atualizar o formulário quando a doação mudar (para edição)
  useEffect(() => {
    if (donation) {
      // Para edição, preencher com os dados da doação
      const categoryId = typeof donation.categoryId === 'object' 
        ? donation.categoryId._id 
        : donation.categoryId;
      
      form.reset({
        categoryId: categoryId || '',
        donorName: donation.donorName || '',
        donorContact: donation.donorContact || '',
        quantity: donation.quantity || 1,
        estimatedValue: donation.estimatedValue || 0,
        unit: donation.unit || '',
        description: donation.description || '',
        receivedDate: donation.receivedDate 
          ? new Date(donation.receivedDate).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
      });
    } else {
      // Para nova doação, limpar o formulário
      form.reset({
        categoryId: '',
        donorName: '',
        donorContact: '',
        quantity: 1,
        estimatedValue: 0,
        unit: '',
        description: '',
        receivedDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [donation, form]);

  const handleSubmit = (values: DonationFormValues) => {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
  };

  const selectedCategory = categories.find((cat: DonationCategory) => cat._id === form.watch('categoryId'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {donation ? 'Editar Doação' : 'Nova Doação'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {donation
              ? 'Edite as informações da doação'
              : 'Preencha as informações para registrar uma nova doação'
            }
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Categoria</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      const category = categories.find((cat: DonationCategory) => cat._id === value);
                      if (category) {
                        form.setValue('unit', category.defaultUnit);
                      }
                    }} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm sm:text-base">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[10001]">
                        {categories.filter((cat: DonationCategory) => cat.isActive).map((category: DonationCategory) => (
                          <SelectItem key={category._id} value={category._id} className="text-sm sm:text-base">
                            <div className="flex items-center space-x-2">
                              <span>{category.icon}</span>
                              <span>{category.name}</span>
                            </div>
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
                name="donorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Doador</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do doador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="donorContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone, email ou outro contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                      <Input 
                        placeholder={selectedCategory?.defaultUnit || "Ex: kg, litros, unidades"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="receivedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Data de Recebimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="text-sm sm:text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre a doação"
                      className="resize-none text-sm sm:text-base"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-sm sm:text-base"
              >
                {isLoading ? 'Salvando...' : donation ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
