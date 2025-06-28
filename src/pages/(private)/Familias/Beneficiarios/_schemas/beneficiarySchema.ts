import { z } from 'zod';

export const beneficiarySchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  birthDate: z.string().nonempty('Data de nascimento é obrigatória'),
  degreeOfKinship: z.string().nonempty('Grau de parentesco é obrigatório'),
  genre: z.string().nonempty('Gênero é obrigatório'),
  cpf: z.string().nonempty('CPF é obrigatório'),
});

export type BeneficiaryFormValues = z.infer<typeof beneficiarySchema>;
