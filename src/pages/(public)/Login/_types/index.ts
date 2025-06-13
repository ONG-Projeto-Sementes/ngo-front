import { z } from 'zod';

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
	email: z.string().email('Digite um e-mail válido'),
	password: z.string().min(3, 'A senha deve ter pelo menos 3 caracteres'),
});
