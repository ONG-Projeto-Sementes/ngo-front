import { Suspense, useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import type { MenuItemsType } from './_types';
import { ERoutes } from '../../types/ERoutes';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { List } from './_components/DropdownList';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect } from 'react';

const menuItems = [
	{
		label: 'Início',
		to: ERoutes.Inicio,
	},
	{
		label: 'Eventos',
		to: ERoutes.Eventos,
	},
	{
		label: 'Voluntários',
		to: ERoutes.Voluntarios,
	},
	{
		label: 'Beneficiários',
		to: ERoutes.Beneficiarios,
	},
	{
		label: 'Recebimentos',
		to: ERoutes.Recebimentos,
	},
] as MenuItemsType[];

export default function AppLayout() {
	const { logout, user } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.matchMedia('(min-width: 640px)').matches) {
				setMobileMenuOpen(false);
			}
		};
		window.addEventListener('resize', handleResize);
		// Run once on mount in case the screen is already large
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className="min-h-screen flex flex-col transition-all duration-300 ease-in-out">
			<header className="bg-white">
				<div className="container mx-auto flex items-center justify-start gap-0 lg:gap-8 px-4 py-1">
					<Link to="/inicio" className="flex items-center min-w-[100px] md:min-w-[110px] lg:min-w-auto">
						<img src="/svg/logo.svg" alt="Logo" className="h-12 w-auto" />
					</Link>

					<nav className="hidden sm:flex sm:items-center gap-0 lg:gap-6">
						<Suspense
							fallback={
								<List.Root>
									{menuItems.map((entry) => (
										<List.Skeleton key={entry.label} />
									))}
								</List.Root>
							}
						>
							<List.Root>
								{menuItems.map((entry) => (
									<List.Item key={entry.label} label={entry.label} to={entry.to!} />
								))}
							</List.Root>
						</Suspense>
					</nav>

					<span className="hidden sm:flex items-center ml-auto gap-2 truncate">
						<Button
							variant="ghost"
							className="w-fit flex items-center justify-center gap-2 cursor-pointer"
							onClick={() => logout()}
						>
							<LogOut className="w-4 h-4" />
						</Button>
						<p className="text-sm mr-4 truncate">{user?.username ?? ''}</p>
						<Avatar>
							<AvatarImage src={'https://github.com/shadcn.png'} alt={user?.username || 'Avatar'} />
							<AvatarFallback>?</AvatarFallback>
						</Avatar>
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
				<header className="fixed bg-white/80 backdrop-blur-sm size-full flex items-center justify-center z-40">
					<div
						className="absolute top-0 left-0 w-full h-full backdrop-blur-sm"
						onClick={() => setMobileMenuOpen(false)}
					/>
					<div className="relative z-10 flex flex-col items-center gap-4">
						<Suspense
							fallback={
								<List.MobileRoot>
									{menuItems.map((entry) => (
										<List.SkeletonMobile key={entry.label} />
									))}
								</List.MobileRoot>
							}
						>
							<List.MobileRoot>
								{menuItems.map((entry) => (
									<List.ItemMobile key={entry.label} label={entry.label} to={entry.to!} />
								))}
							</List.MobileRoot>
						</Suspense>

						<Button
							variant="ghost"
							className="w-fit flex items-center justify-center gap-2 cursor-pointer"
							onClick={() => {
								logout();
								setMobileMenuOpen(false);
							}}
						>
							<LogOut className="size-4" /> <p>Sair</p>
						</Button>
					</div>
				</header>
			)}
			<main className="flex-1 container mx-auto px-4 py-6">
				<Outlet />
			</main>
		</div>
	);
}
