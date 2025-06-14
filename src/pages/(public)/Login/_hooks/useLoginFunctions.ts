import { toast } from 'sonner';
import login from '@/services/auth/login.ts';
import { useNavigate } from 'react-router-dom';
import useMutation from '@/hooks/useMutation.tsx';
import { useAuth } from '@/context/AuthContext.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/pages/(public)/Login/_types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { LoginFormData } from '@/pages/(public)/Login/_types';

export default function useLoginFunctions() {
	const { login: loginContext } = useAuth();
	const navigate = useNavigate();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const mutation = useMutation(login, {
		onSuccess: (data) => {
			loginContext({ email: data.email, password: data.password });
			toast.success('Login realizado com sucesso!');
			navigate('/inicio', { replace: true });
		},
		onError: (error) => {
			toast.error(Boolean(error.message) ? error.message : 'Erro desconhecido no login.');
		},
	});

	const onSubmit: SubmitHandler<LoginFormData> = (data) => {
		mutation.mutate(data);
	};

	return {
		onSubmit,
		form,
		isLoading: mutation.isPending,
	};
}
