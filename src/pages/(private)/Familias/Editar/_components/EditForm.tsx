import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditFamily } from '../_hooks/useEditFamily';

const familySchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  city: z.string().nonempty('Cidade é obrigatória'),
  neighborhood: z.string().nonempty('Bairro é obrigatório'),
  address: z.string().nonempty('Endereço é obrigatório'),
  contact: z.string().nonempty('Contato é obrigatório'),
});

type FormValues = z.infer<typeof familySchema>;

interface Props {
  familyId: string;
}

export default function EditForm({ familyId }: Props) {
  const { data, isLoading, isError, error, mutate, isPending } = useEditFamily(familyId);

  const form = useForm<FormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: '',
      city: '',
      neighborhood: '',
      address: '',
      contact: '',
    },
  });

  // popula o form quando a API responder
  useEffect(() => {
    if (!data) return;
    form.setValue('name', data.name);
    form.setValue('city', data.city);
    form.setValue('neighborhood', data.neighborhood);
    form.setValue('address', data.address);
    form.setValue('contact', data.contact);
  }, [data, form]);

  const onSubmit = (vals: FormValues) => {
    mutate(vals);
  };

  if (isLoading) return <p>Carregando família...</p>;
  if (isError) return <p className="text-red-600">{(error as Error).message}</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campos de texto */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['name', 'city', 'neighborhood', 'address', 'contact'] as const).map((field) => {
              const labels = {
                name: 'Nome *',
                city: 'Cidade *',
                neighborhood: 'Bairro *',
                address: 'Endereço *',
                contact: 'Contato *',
              } as const;
              return (
                <div key={field} className={`space-y-1 ${field === 'contact' ? 'md:col-span-2' : ''}`}>
                  <Label htmlFor={field}>{labels[field]}</Label>
                  <Input id={field} {...form.register(field)} placeholder={labels[field].replace('*', '').trim()} />
                  {form.formState.errors[field] && (
                    <p className="text-red-600 text-sm">{form.formState.errors[field]?.message}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botão Salvar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center lg:w-80">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Atualizando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
