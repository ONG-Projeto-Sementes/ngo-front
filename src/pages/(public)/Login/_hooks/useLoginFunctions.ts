import { useAuth } from '@/context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { LoginFormData } from '@/pages/Authentication/_types';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/pages/Authentication/_types';
import useMutation from '@/hooks/useMutation.tsx';
import login from '@/services/auth/login.ts';
import { toast } from 'sonner';

export default function useLoginFunctions() {
	const { login: loginContext } = useAuth();

	const navigate = useNavigate();

	const form = useForm<LoginFormData>({
		resolver: zodResolver<LoginFormData>(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const mutation = useMutation(login, {
		onSuccess: (data) => {
			loginContext({ email: data.email, password: data.password });
			toast.success('Login realizado com sucesso!');
			navigate('/inicio', { replace: true });
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : 'Erro desconhecido no login.');
		},
	});

	const onSubmit = (data: LoginFormData) => {
		mutation.mutate(data);
	};

	return {
		onSubmit,
		form,
		isLoading: mutation.isPending,
	};
}