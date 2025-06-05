import { z } from 'zod';
import logo from '@/assets/logo.svg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import { signIn } from '@/api/users';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import InputField from '@/components/InputField/InputField';

import { useNavigate, useLocation } from 'react-router-dom';

const loginSchema = z.object({
	email: z.string().email('Digite um e-mail válido'),
	password: z.string().min(3, 'A senha deve ter pelo menos 3 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const navigate = useNavigate();
	const location = useLocation();
	const fromPath = location.state?.from?.pathname || '/';

	function onSubmit(values: LoginFormData) {
		mutate(values);
	}

	const { mutate, isPending } = useMutation({
		mutationFn: (data: LoginFormData) => signIn(data),
		onSuccess: () => {
			toast.success('Login realizado com sucesso!');
			navigate(fromPath, { replace: true });
		},
		onError: (error) => {
			toast.error(`Falha no login. ${error}.`);
		},
	});

	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-transparent p-4">
				<div className="container mx-auto">
					<img src={logo} alt="Logo" />
				</div>
			</header>

			<main className="flex-1 flex flex-col items-center justify-center max-h-screen container mx-auto p-4 text-center">
				<h3 className="text-xl font-semibold mb-2">Olá, bem-vindo ao Projeto Sementes</h3>
				<p className="text-sm text-muted-foreground mb-4">Por favor, faça login para continuar.</p>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-xs md:max-w-sm my-4">
						<InputField
							control={form.control}
							name="email"
							type="text"
							placeholder="Digite seu e-mail"
							disabled={isPending}
						/>

						<InputField
							control={form.control}
							name="password"
							type="password"
							placeholder="Digite sua senha"
							disabled={isPending}
						/>

						<Button type="submit" className="w-full" disabled={isPending} isLoading={isPending}>
							Entrar
						</Button>
					</form>
				</Form>
			</main>
		</div>
	);
}
