import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useRegisterBeneficiary from '../_hooks/useRegisterBeneficiary';
import { beneficiarySchema, type BeneficiaryFormValues } from '../_schemas/beneficiarySchema';

interface Props {
  familyId: string;
}

export default function BeneficiaryForm({ familyId }: Props) {
  const form = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      name: '',
      birthDate: '',
      degreeOfKinship: '',
      genre: '',
      cpf: '',
    },
  });

  const { mutate, isPending } = useRegisterBeneficiary(familyId, form);

  const onSubmit = (values: BeneficiaryFormValues) => {
    mutate(values);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Adicionar Beneficiário</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nome */}
            <div className="space-y-1">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...form.register('name')} placeholder="Nome completo" />
              {form.formState.errors.name && (
                <p className="text-red-600 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* CPF */}
            <div className="space-y-1">
              <Label htmlFor="cpf">CPF *</Label>
              <Input id="cpf" {...form.register('cpf')} placeholder="123.456.789-00" />
              {form.formState.errors.cpf && (
                <p className="text-red-600 text-sm">{form.formState.errors.cpf.message}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-1">
              <Label htmlFor="birthDate">Data de Nascimento *</Label>
              <Input id="birthDate" type="date" {...form.register('birthDate')} />
              {form.formState.errors.birthDate && (
                <p className="text-red-600 text-sm">{form.formState.errors.birthDate.message}</p>
              )}
            </div>

            {/* Grau de Parentesco */}
            <div className="space-y-1">
              <Label htmlFor="degreeOfKinship">Grau de Parentesco *</Label>
              <Input 
                id="degreeOfKinship" 
                {...form.register('degreeOfKinship')} 
                placeholder="Ex: Filho(a), Pai, Mãe, etc." 
              />
              {form.formState.errors.degreeOfKinship && (
                <p className="text-red-600 text-sm">{form.formState.errors.degreeOfKinship.message}</p>
              )}
            </div>

            {/* Gênero */}
            <div className="space-y-1">
              <Label htmlFor="genre">Gênero *</Label>
              <Input 
                id="genre" 
                {...form.register('genre')} 
                placeholder="Masculino, Feminino, Outro" 
              />
              {form.formState.errors.genre && (
                <p className="text-red-600 text-sm">{form.formState.errors.genre.message}</p>
              )}
            </div>

            {/* Botão */}
            <div className="flex items-end">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Adicionando...' : 'Adicionar Beneficiário'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
