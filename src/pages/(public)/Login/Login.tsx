import { Form } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import InputField from '@/components/InputField/InputField.tsx';
import useLoginFunctions from '@/pages/(public)/Login/_hooks/useLoginFunctions.ts';

export default function Login() {
	const { form, isPending, onSubmit } = useLoginFunctions();

	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-transparent p-4">
				<div className="container mx-auto">
					<img src={'/svg/logo.svg'} alt="Logo" />
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
						<Button type="submit" className="w-full" isLoading={isPending} disabled={isPending}>
							Entrar
						</Button>
					</form>
				</Form>
			</main>
		</div>
	);
}
