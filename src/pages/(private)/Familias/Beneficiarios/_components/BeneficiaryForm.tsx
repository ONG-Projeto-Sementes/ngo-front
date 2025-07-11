import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField/InputField';
import useRegisterBeneficiary from '../_hooks/useRegisterBeneficiary';
import { beneficiarySchema, type BeneficiaryFormValues } from '../_schemas/beneficiarySchema';

// Função para formatar CPF
const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return value;
};

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
            <InputField
              name="name"
              label="Nome *"
              control={form.control}
              placeholder="Nome completo"
            />

            {/* CPF */}
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="000.000.000-00" 
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value);
                        field.onChange(formatted);
                      }}
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data de Nascimento */}
            <InputField
              name="birthDate"
              label="Data de Nascimento *"
              type="date"
              control={form.control}
            />

            {/* Grau de Parentesco */}
            <InputField
              name="degreeOfKinship"
              label="Grau de Parentesco *"
              control={form.control}
              placeholder="Ex: Filho(a), Pai, Mãe, etc."
            />

            {/* Gênero */}
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
