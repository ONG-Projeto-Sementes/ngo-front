import { z } from 'zod';

export const donationSchema = z.object({
  donorName: z.string().min(1, 'Nome do doador é obrigatório'),
  donorContact: z.string().min(1, 'Contato do doador é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  status: z.enum(['pending', 'received', 'distributed']),
  quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  estimatedValue: z.number().min(0, 'Valor deve ser maior ou igual a 0'),
  receivedDate: z.string().min(1, 'Data de recebimento é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  notes: z.string().optional(),
});
