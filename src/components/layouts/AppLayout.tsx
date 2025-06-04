import logo from '@/assets/logo.svg';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-transparent p-4">
				<div className="container mx-auto">
					<img src={logo} alt="Logo" />
				</div>
			</header>

			<main className="flex-1 container mx-auto p-4">
				<Outlet />
			</main>
		</div>
	);
}
