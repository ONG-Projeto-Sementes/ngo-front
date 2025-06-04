import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import LoginPage from '@/pages/login/Login';
import HomePage from '@/pages/home/Home.tsx';
import AppLayout from '@/components/layouts/AppLayout';

// eslint-disable-next-line react-refresh/only-export-components
export const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{
				path: '',
				element: <HomePage />,
			},
			{
				path: 'dashboard',
				element: <div>Dashboard</div>,
			},
			// outras rotas internas aqui
		],
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
]);

export default function AppRouter() {
	return <RouterProvider router={router} />;
}
