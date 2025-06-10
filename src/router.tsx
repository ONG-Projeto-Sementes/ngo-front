import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout';
import NotFound from './pages/Others/screens/NotFound';
import Inicio from './pages/System/Cover/screens/Inicio';
import Login from './pages/Authentication/screens/Login';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { RequireAuth } from './components/RequireAuth/RequireAuth';

export default function AppRouter() {
	return (
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

			{/* Todas as rotas privadas */}
			<Route
				element={
					<RequireAuth>
						<AppLayout />
					</RequireAuth>
				}
			>
				<Route path="/inicio" element={<Inicio />} />
			</Route>

			{/* Catch-all 404 */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
