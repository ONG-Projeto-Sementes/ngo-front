import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ERoutes } from './types/ERoutes';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout';
import { RequireAuth } from './components/RequireAuth/RequireAuth';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import NotFound from '@/pages/(public)/Others/NotFound/NotFound.tsx';

const Login = lazy(() => import('@/pages/(public)/Login/Login'));
const Home = lazy(() => import('@/pages/(private)/Home/Home.tsx'));
const Doacoes = lazy(() => import('@/pages/(private)/Doacoes/Doacoes.tsx'));
const Eventos = lazy(() => import('@/pages/(private)/Eventos/Eventos.tsx'));
const Voluntarios = lazy(() => import('@/pages/(private)/Voluntarios/Voluntarios.tsx'));
const Recebimentos = lazy(() => import('@/pages/(private)/Recebimentos/Recebimentos.tsx'));
const Beneficiarios = lazy(() => import('@/pages/(private)/Beneficiarios/Beneficiarios.tsx'));

export default function AppRouter() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-screen">
					<Loader2 className="size-4 animate-spin" />
				</div>
			}
		>
			<Routes>
				{/* Rota pública */}
				<Route
					path={ERoutes.Login}
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
					<Route path={ERoutes.Inicio} element={<Home />} />
					<Route path={ERoutes.Voluntarios} element={<Voluntarios />} />
					<Route path={ERoutes.Recebimentos} element={<Recebimentos />} />
					<Route path={ERoutes.Eventos} element={<Eventos />} />
					<Route path={ERoutes.Doacoes} element={<Doacoes />} />
					<Route path={ERoutes.Beneficiarios} element={<Beneficiarios />} />
				</Route>

				{/* Página não encontrada */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}
