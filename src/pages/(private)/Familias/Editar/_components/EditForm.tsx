import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditFamily } from '../_hooks/useEditFamily';
import InputField from '@/components/InputField/InputField';
import FamilyBeneficiariesSection from './FamilyBeneficiariesSection';

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

  // Popula o formulário com os dados da família quando carregados
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || '',
        city: data.city || '',
        neighborhood: data.neighborhood || '',
        address: data.address || '',
        contact: data.contact || '',
      });
    }
  }, [data, form]);

  const onSubmit = (vals: FormValues) => {
    mutate(vals);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center lg:w-80">
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-red-600 text-center">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Formulário de edição da família */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Campos de texto */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="name"
                  label="Nome *"
                  control={form.control}
                  placeholder="Nome da família"
                />
                
                <InputField
                  name="city"
                  label="Cidade *"
                  control={form.control}
                  placeholder="Cidade"
                />
                
                <InputField
                  name="neighborhood"
                  label="Bairro *"
                  control={form.control}
                  placeholder="Bairro"
                />
                
                <InputField
                  name="address"
                  label="Endereço *"
                  control={form.control}
                  placeholder="Endereço completo"
                />
              </div>
              
              <InputField
                name="contact"
                label="Contato *"
                control={form.control}
                placeholder="Telefone ou celular"
              />
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

      {/* Seção de beneficiários */}
      <FamilyBeneficiariesSection familyId={familyId} />
    </div>
  );
}
