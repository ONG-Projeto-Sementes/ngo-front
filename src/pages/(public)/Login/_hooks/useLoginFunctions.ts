import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginFormData } from '@/pages/(public)/Login/_types';

export default function useLoginFunctions() {
	const { login, isPending } = useAuth();
	const navigate = useNavigate();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
		try {
			await login({ email: data.email, password: data.password });
			toast.success('Login realizado com sucesso!');
			navigate('/inicio', { replace: true });
		} catch (err: any) {
			toast.error(err.message ?? 'Erro desconhecido no login.');
		}
	};

	return {
		form,
		onSubmit,
		isPending,
	};
}
