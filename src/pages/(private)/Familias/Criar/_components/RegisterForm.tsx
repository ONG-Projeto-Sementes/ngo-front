import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
          {/* CARD MAIOR: campos de texto em grid */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-1">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...form.register('name')} placeholder="Família Silva" />
              {form.formState.errors.name && (
                <p className="text-red-600 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>
            {/* Cidade */}
            <div className="space-y-1">
              <Label htmlFor="city">Cidade *</Label>
              <Input id="city" {...form.register('city')} placeholder="Rio de Janeiro" />
              {form.formState.errors.city && (
                <p className="text-red-600 text-sm">{form.formState.errors.city.message}</p>
              )}
            </div>
            {/* Bairro */}
            <div className="space-y-1">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input id="neighborhood" {...form.register('neighborhood')} placeholder="Copacabana" />
              {form.formState.errors.neighborhood && (
                <p className="text-red-600 text-sm">{form.formState.errors.neighborhood.message}</p>
              )}
            </div>
            {/* Endereço */}
            <div className="space-y-1">
              <Label htmlFor="address">Endereço *</Label>
              <Input id="address" {...form.register('address')} placeholder="Av. Atlântica, 456" />
              {form.formState.errors.address && (
                <p className="text-red-600 text-sm">{form.formState.errors.address.message}</p>
              )}
            </div>
            {/* Contato */}
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="contact">Contato *</Label>
              <Input id="contact" {...form.register('contact')} placeholder="21 98888‑8888" />
              {form.formState.errors.contact && (
                <p className="text-red-600 text-sm">{form.formState.errors.contact.message}</p>
              )}
            </div>
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
