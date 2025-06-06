import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/InputField/InputField';

const loginSchema = z.object({
	email: z.string().email('Digite um e-mail válido'),
	password: z.string().min(3, 'A senha deve ter pelo menos 3 caracteres'),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	async function onSubmit(values: LoginFormData) {
		try {
			await login(values);
			toast.success('Login realizado com sucesso!');
			navigate('/inicio', { replace: true });
		} catch (err: any) {
			toast.error(`Falha no login. ${err.message}`);
		}
	}

	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-transparent p-4">
				<div className="container mx-auto">
					<img src={'/logo.svg'} alt="Logo" />
				</div>
			</header>

			<main className="flex-1 flex flex-col items-center justify-center container mx-auto p-4 text-center">
				<h3 className="text-xl font-semibold mb-2">Olá, bem-vindo ao Projeto Sementes</h3>
				<p className="text-sm text-muted-foreground mb-4">Por favor, faça login para continuar.</p>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-3 w-full max-w-xs md:max-w-sm my-4 sm:text-start"
					>
						<InputField control={form.control} name="email" type="text" placeholder="Digite seu e-mail" />
						<InputField control={form.control} name="password" type="password" placeholder="Digite sua senha" />
						<Button type="submit" className="w-full">
							Entrar
						</Button>
					</form>
				</Form>
			</main>
		</div>
	);
}
