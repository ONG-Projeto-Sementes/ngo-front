import { z } from 'zod';
import { toast } from 'sonner';
import useMutation from '@/hooks/useMutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import postVolunteer from '@/services/volunteer/postVolunteer';

export const registerVolunteerSchema = z.object({
	name: z
		.string()
		.min(2, 'O nome deve ter pelo menos 2 caracteres')
		.max(100, 'O nome deve ter no máximo 100 caracteres'),
	cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres').max(14, 'CPF deve ter no máximo 14 caracteres'),
	contact: z
		.string()
		.min(8, 'Contato deve ter pelo menos 8 caracteres')
		.max(40, 'Contato deve ter no máximo 40 caracteres'),
});

export type RegisterVolunteerFormData = z.infer<typeof registerVolunteerSchema>;

export default function useRegisterVolunteer() {
	const form = useForm<RegisterVolunteerFormData>({
		resolver: zodResolver(registerVolunteerSchema),
		defaultValues: { name: '', cpf: '', contact: '' },
	});

	const queryClient = useQueryClient();

	const mutation = useMutation(postVolunteer, {
		onSuccess: (data) => {
			toast.success(`Voluntário(a) ${data.name} registrado(a) com sucesso!`);
			queryClient.invalidateQueries({ queryKey: ['volunteers'] });
		},
		onError: (error: any) => {
			toast.error(error?.message ?? 'Erro desconhecido ao registrar voluntário.');
		},
	});

	const onSubmit: SubmitHandler<RegisterVolunteerFormData> = (data) => {
		mutation.mutate(data);
	};

	return {
		form,
		onSubmit,
		isLoading: mutation.isPending,
	};
}
