import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout';
import NotFound from '@/pages/(public)/Others/NotFound/NotFound.tsx';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { RequireAuth } from './components/RequireAuth/RequireAuth';

const Login = lazy(() => import('@/pages/(public)/Login/Login'));
const Home = lazy(() => import('@/pages/(private)/Home/Home.tsx'));

export default function AppRouter() {
	return (
		<Suspense fallback={<div>Carregando...</div>}>
			<Routes>
				{/* Rota pública */}
				<Route
					path="/login"
					element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}
				/>

				{/* Rotas privadas */}
				<Route
					element={
						<RequireAuth>
							<AppLayout />
						</RequireAuth>
					}
				>
					<Route path="/inicio" element={<Home />} />
				</Route>

				{/* Página não encontrada */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}
