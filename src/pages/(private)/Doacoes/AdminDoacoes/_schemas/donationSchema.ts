import { z } from 'zod';

export const donationSchema = z.object({
  categoryId: z.string().nonempty('Categoria é obrigatória'),
  donorName: z.string().nonempty('Nome do doador é obrigatório'),
  donorContact: z.string().optional(),
  quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  estimatedValue: z.number().min(0, 'Valor deve ser maior ou igual a 0'),
  unit: z.string().nonempty('Unidade é obrigatória'),
  description: z.string().optional(),
  receivedDate: z.string().optional(),
});

export type DonationFormValues = z.infer<typeof donationSchema>;
