import { z } from 'zod';

export const familySchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  city: z.string().nonempty('Cidade é obrigatória'),
  neighborhood: z.string().nonempty('Bairro é obrigatório'),
  address: z.string().nonempty('Endereço é obrigatório'),
  contact: z.string().nonempty('Contato é obrigatório'),
});

export type FamilyFormValues = z.infer<typeof familySchema>;
