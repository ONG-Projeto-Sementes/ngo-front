import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/InputField/InputField';
import { donationCategorySchema, type DonationCategoryFormValues } from '../_schemas/donationCategorySchema';
import type { DonationCategory } from '@/pages/(private)/Doacoes/_types/DonationCategory';
import { Loader2 } from 'lucide-react';

interface DonationCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: DonationCategory;
  onSubmit: (data: DonationCategoryFormValues) => void;
  isLoading?: boolean;
}

export function DonationCategoryFormDialog({ 
  open, 
  onOpenChange, 
  category, 
  onSubmit, 
  isLoading = false 
}: DonationCategoryFormDialogProps) {
  const form = useForm<DonationCategoryFormValues>({
    resolver: zodResolver(donationCategorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      defaultUnit: category?.defaultUnit || '',
      icon: category?.icon || '📦',
      color: category?.color || '#6b7280',
      isActive: category?.isActive ?? true,
    },
  });

  const handleSubmit = (data: DonationCategoryFormValues) => {
    onSubmit(data);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </SheetTitle>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-6">
            <InputField<DonationCategoryFormValues>
              control={form.control}
              name="name"
              label="Nome"
              placeholder="Nome da categoria"
            />

            <InputField<DonationCategoryFormValues>
              control={form.control}
              name="description"
              label="Descrição"
              placeholder="Descrição da categoria"
            />

            <InputField<DonationCategoryFormValues>
              control={form.control}
              name="defaultUnit"
              label="Unidade Padrão"
              placeholder="Ex: kg, unidade, litro"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField<DonationCategoryFormValues>
                control={form.control}
                name="icon"
                label="Ícone (Emoji)"
                placeholder="📦"
              />

              <InputField<DonationCategoryFormValues>
                control={form.control}
                name="color"
                label="Cor"
                type="color"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {category ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
