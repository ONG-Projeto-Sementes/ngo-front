import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputField from '@/components/InputField/InputField';
import useEditBeneficiary from '../_hooks/useEditBeneficiary';

// Função para formatar CPF
const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return value;
};

const beneficiarySchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  birthDate: z.string().nonempty('Data de nascimento é obrigatória'),
  degreeOfKinship: z.string().nonempty('Grau de parentesco é obrigatório'),
  genre: z.string().nonempty('Gênero é obrigatório'),
  cpf: z.string().nonempty('CPF é obrigatório'),
});

type FormValues = z.infer<typeof beneficiarySchema>;

interface Props {
  familyId: string;
  beneficiaryId: string;
}

export default function EditBeneficiaryForm({ familyId, beneficiaryId }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      name: '',
      birthDate: '',
      degreeOfKinship: '',
      genre: '',
      cpf: '',
    },
  });

  const { data, isLoading, isError, error, mutate, isPending } = useEditBeneficiary(familyId, beneficiaryId);

  // Popula o formulário quando os dados chegarem
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || '',
        birthDate: data.birthDate ? data.birthDate.split('T')[0] : '', // Formata para yyyy-mm-dd
        degreeOfKinship: data.degreeOfKinship || '',
        genre: data.genre || '',
        cpf: data.cpf || '',
      });
    }
  }, [data, form]);

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500">Carregando dados do beneficiário...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-red-600">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4">Editar Beneficiário</h3>
      
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                {isPending ? 'Atualizando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
