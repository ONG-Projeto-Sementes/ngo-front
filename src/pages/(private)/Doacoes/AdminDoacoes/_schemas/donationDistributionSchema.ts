import { z } from 'zod';

export const donationDistributionSchema = z.object({
  donationId: z.string().nonempty('Doação é obrigatória'),
  familyId: z.string().nonempty('Família é obrigatória'),
  quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  notes: z.string().optional(),
});

export type DonationDistributionFormValues = z.infer<typeof donationDistributionSchema>;
