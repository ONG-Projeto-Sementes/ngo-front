import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().optional(),
  maxVolunteers: z.number().min(1, 'Número mínimo de voluntários é 1').optional(),
  image: z
    .instanceof(FileList)
    .optional()
    .refine((list) => !list || list.length <= 1, 'Envie apenas um arquivo'),
});

export const eventEditSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().optional(),
  maxVolunteers: z.number().min(1, 'Número mínimo de voluntários é 1').optional(),
  image: z
    .instanceof(FileList)
    .optional()
    .refine((list) => !list || list.length <= 1, 'Envie apenas um arquivo'),
});

export type EventFormData = z.infer<typeof eventSchema>;
export type EventEditFormData = z.infer<typeof eventEditSchema>;
