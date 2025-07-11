import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField/InputField';
import useRegisterFamily from '../_hooks/useRegisterFamily';
import { familySchema, type FamilyFormValues } from '../_schemas/familySchema';

export default function RegisterForm() {
  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: '',
      city: '',
      neighborhood: '',
      address: '',
      contact: '',
    },
  });

  const { mutate, isPending } = useRegisterFamily(form);

  const onSubmit = (values: FamilyFormValues) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* CARD MAIOR: campos de texto */}
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
                placeholder="Rio de Janeiro"
              />
              
              <InputField
                name="neighborhood"
                label="Bairro *"
                control={form.control}
                placeholder="Copacabana"
              />
              
              <InputField
                name="address"
                label="Endereço *"
                control={form.control}
                placeholder="Av. Atlântica, 456"
              />
            </div>
            
            <InputField
              name="contact"
              label="Contato *"
              control={form.control}
              placeholder="21 98888-8888"
            />
          </div>

            {/* CARD PEQUENO: Botão Cadastrar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 lg:w-80">
            <div className="text-center">
              <h4 className="font-medium text-gray-900">Próximos Passos</h4>
              <p className="text-sm text-gray-600 mt-1">
                Após cadastrar a família, você será direcionado para adicionar os beneficiários.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Enviando...' : 'Cadastrar Família'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
