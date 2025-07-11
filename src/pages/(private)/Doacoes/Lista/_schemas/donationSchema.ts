import { z } from 'zod';

export const donationSchema = z.object({
  donorName: z.string().nonempty('Nome do doador é obrigatório'),
  donorContact: z.string().nonempty('Contato do doador é obrigatório'),
  categoryId: z.string().nonempty('Categoria é obrigatória'),
  quantity: z.number().positive('Quantidade deve ser maior que 0'),
  unit: z.string().nonempty('Unidade é obrigatória'),
  description: z.string().nonempty('Descrição é obrigatória'),
  estimatedValue: z.number().nonnegative('Valor estimado deve ser 0 ou maior'),
  receivedDate: z.string().nonempty('Data de recebimento é obrigatória'),
  status: z.enum(['pending', 'received', 'distributed']),
  notes: z.string().optional(),
});

export type DonationFormValues = z.infer<typeof donationSchema>;
