import { z } from 'zod';

export const donationSchema = z.object({
  donorName: z.string().min(1, 'Nome do doador é obrigatório'),
  donorContact: z.string().optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  description: z.string().optional(),
  estimatedValue: z.number().min(0, 'Valor deve ser maior ou igual a 0').optional(),
  receivedDate: z.string().min(1, 'Data é obrigatória'),
  status: z.enum(['pending', 'received', 'distributed', 'expired']).default('pending'),
  notes: z.string().optional(),
});

export type DonationFormData = z.infer<typeof donationSchema>;
