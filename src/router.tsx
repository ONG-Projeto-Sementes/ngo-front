import { Loader2 } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ERoutes } from '@/types/ERoutes';
import AppLayout from '@/components/layouts/AppLayout';
import NotFound from '@/pages/(public)/Others/NotFound/NotFound';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { RequireAuth } from './components/RequireAuth/RequireAuth';

const Login = lazy(() => import('@/pages/(public)/Login/Login'));
const Home = lazy(() => import('@/pages/(private)/Home/Home'));
const Doacoes = lazy(() => import('@/pages/(private)/Doacoes/Doacoes'));
const Eventos = lazy(() => import('@/pages/(private)/Eventos/Eventos'));
const Voluntarios = lazy(() => import('@/pages/(private)/Voluntarios/Voluntarios'));
const Recebimentos = lazy(() => import('@/pages/(private)/Recebimentos/Recebimentos'));
const Beneficiarios = lazy(() => import('@/pages/(private)/Beneficiarios/Beneficiarios'));

export default function AppRouter() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-screen">
					<Loader2 className="animate-spin" />
				</div>
			}
		>
			<Routes>
				<Route path="/" element={<Navigate to={ERoutes.Login} replace />} />

				{/* público */}
				<Route
					path={ERoutes.Login}
					element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}
				/>

				{/* privado */}
				<Route
					element={
						<RequireAuth>
							<AppLayout />
						</RequireAuth>
					}
				>
					<Route path={ERoutes.Inicio} element={<Home />} />
					<Route path={ERoutes.Doacoes} element={<Doacoes />} />
					<Route path={ERoutes.Eventos} element={<Eventos />} />
					<Route path={ERoutes.Voluntarios} element={<Voluntarios />} />
					<Route path={ERoutes.Recebimentos} element={<Recebimentos />} />
					<Route path={ERoutes.Beneficiarios} element={<Beneficiarios />} />
				</Route>

				{/* fallback */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}
