import { Outlet } from 'react-router-dom';

export default function AppLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-black text-white p-4">
				<div className="container mx-auto">
					<h1 className="text-xl font-bold">My App</h1>
				</div>
			</header>

			<main className="flex-1 container mx-auto p-4">
				<Outlet />
			</main>
		</div>
	);
}
