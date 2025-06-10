import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, X, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function AppLayout() {
	const { logout, user } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const menuItems = [
		{
			label: 'Início',
			to: '/inicio',
		},
		{
			label: 'Cadastros',
			items: [
				{
					label: 'Evento',
					subLabel: 'Cadastro de evento.',
					to: '/evento-cadastro',
				},
				{
					label: 'Doação',
					subLabel: 'Cadastro de doação.',
					to: '/doacao-cadastro',
				},
				{
					label: 'Voluntário',
					subLabel: 'Cadastro de voluntário.',
					to: '/voluntario-cadastro',
				},
				{
					label: 'Pessoas acolhidas pelo projeto',
					subLabel: 'Cadastro de pessoas acolhidas pelo projeto.',
					to: '/beneficiado-cadastro',
				},
				{
					label: 'Recebimento',
					subLabel: 'Cadastro de recebimento do auxílio.',
					to: '/recebimento-cadastro',
				},
			],
		},
		{
			label: 'Visualizações',
			items: [
				{
					label: 'Eventos',
					subLabel: 'Visualização de eventos.',
					to: '/eventos-visualizacao',
				},
				{
					label: 'Doações',
					subLabel: 'Visualização de doações.',
					to: '/doacoes-visualizacao',
				},
				{
					label: 'Voluntários',
					subLabel: 'Visualização de voluntários.',
					to: '/voluntarios-visualizacao',
				},
				{
					label: 'Pessoas acolhidas pelo projeto',
					subLabel: 'Visualização de pessoas acolhidas pelo projeto.',
					to: '/beneficiados-visualizacao',
				},
				{
					label: 'Recebimentos',
					subLabel: 'Visualização de recebimentos dos auxílios.',
					to: '/recebimentos-visualizacao',
				},
			],
		},
	];

	return (
		<div className="min-h-screen flex flex-col transition-all duration-300 ease-in-out">
			<header className="bg-white">
				<div className="container mx-auto flex items-center justify-start gap-0 lg:gap-8 px-4 py-3">
					<Link to="/inicio" className="flex items-center min-w-[100px] md:min-w-[110px] lg:min-w-auto">
						<img src="/svg/logo.svg" alt="Logo" className="h-8 w-auto" />
					</Link>

					<nav className="hidden sm:flex sm:items-center gap-0 lg:gap-6">
						{menuItems.map((entry) => {
							if (!entry.items) {
								return (
									<Link
										to={entry.to!}
										key={entry.label}
										className="px-2 py-1 text-gray-700 hover:text-foreground hover:underline"
									>
										{entry.label}
									</Link>
								);
							}

							return (
								<DropdownMenu key={entry.label}>
									<DropdownMenuTrigger asChild>
										<Button
											variant="link"
											className="px-2 py-1 text-gray-700 hover:text-foreground cursor-pointer group"
										>
											{entry.label} <ChevronDown />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-auto">
										{entry.items!.map((subItem) => (
											<DropdownMenuItem key={subItem.label} asChild>
												<Link to={subItem.to} className="flex flex-col items-start cursor-pointer">
													<span className="font-medium">{subItem.label}</span>
													<span className="text-xs text-muted-foreground">{subItem.subLabel}</span>
												</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							);
						})}
					</nav>

					<span className="hidden sm:flex items-center ml-auto gap-2 truncate">
						<p className="text-sm mr-2 truncate">{user?.username}</p>
						<Avatar>
							<AvatarImage src={'https://github.com/shadcn.png'} alt={user?.username || 'Avatar'} />
							<AvatarFallback>?</AvatarFallback>
						</Avatar>
						<Button
							variant="ghost"
							className="w-fit flex items-center justify-center gap-2 cursor-pointer"
							onClick={() => logout()}
						>
							<LogOut className="w-4 h-4" />
						</Button>
					</span>

					<Button
						variant="ghost"
						onClick={() => setMobileMenuOpen(true)}
						className="sm:hidden p-2 cursor-pointer ml-auto"
					>
						<Menu className="w-6 h-6" />
					</Button>
				</div>
			</header>

			{mobileMenuOpen && (
				<div className="fixed inset-0 z-50 bg-white flex flex-col">
					<div className="flex items-center justify-between px-4 py-3 border-b">
						<span className="font-semibold text-lg">Menu</span>
						<Button variant="ghost" onClick={() => setMobileMenuOpen(false)} className="p-2 cursor-pointer">
							<X className="w-6 h-6" />
						</Button>
					</div>

					<nav className="flex-grow overflow-auto px-4 py-6">
						<Accordion type="single" collapsible className="space-y-0">
							{menuItems.map((entry) => {
								if (!entry.items) {
									return (
										<div key={entry.label}>
											<Link
												to={entry.to!}
												onClick={() => setMobileMenuOpen(false)}
												className="block text-base px-2 py-1 hover:bg-gray-100 rounded-t border-b text-foreground cursor-pointer hover:underline"
											>
												{entry.label}
											</Link>
										</div>
									);
								}

								return (
									<AccordionItem key={entry.label} value={entry.label}>
										<AccordionTrigger className="w-full text-left px-2 py-2 text-base font-medium text-foreground hover:bg-gray-100 rounded border-foraground hover:text-foreground cursor-pointer">
											{entry.label}
										</AccordionTrigger>
										<AccordionContent className="pl-4">
											<ul className="flex flex-col gap-2">
												{entry.items!.map((subItem) => (
													<li key={subItem.label}>
														<Link
															to={subItem.to}
															onClick={() => setMobileMenuOpen(false)}
															className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded"
														>
															<span className="font-medium">{subItem.label}</span>
															<p className="text-xs text-gray-400">{subItem.subLabel}</p>
														</Link>
													</li>
												))}
											</ul>
										</AccordionContent>
									</AccordionItem>
								);
							})}
						</Accordion>
					</nav>

					<div className="px-4 py-4 border-t">
						<Button
							variant="outline"
							className="w-full flex items-center justify-center gap-2 cursor-pointer"
							onClick={() => {
								logout();
								setMobileMenuOpen(false);
							}}
						>
							<LogOut className="w-4 h-4" /> Sair
						</Button>
					</div>
				</div>
			)}

			<main className="flex-1 container mx-auto px-4 py-6">
				<Outlet />
			</main>
		</div>
	);
}
