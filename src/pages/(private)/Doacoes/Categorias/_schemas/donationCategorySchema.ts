import { z } from 'zod';

export const donationCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  defaultUnit: z.string().min(1, 'Unidade padrão é obrigatória'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
  isActive: z.boolean(),
});

export type DonationCategoryFormValues = z.infer<typeof donationCategorySchema>;
