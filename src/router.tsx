import HomePage from './pages/home/Home';
import LoginPage from './pages/login/Login';
import { Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { RequireAuth } from './components/RequireAuth/RequireAuth';

export default function AppRouter() {
	return (
		<Routes>
			{/* Rotas públicas */}
			<Route
				path="/login"
				element={
					<PublicRoute>
						<LoginPage />
					</PublicRoute>
				}
			/>

			{/* Rotas protegidas */}
			<Route
				path="/"
				element={
					<RequireAuth>
						<HomePage />
					</RequireAuth>
				}
			/>
			<Route
				path="/dashboard"
				element={
					<RequireAuth>
						<DashboardPage />
					</RequireAuth>
				}
			/>

			{/* Catch‑all 404 */}
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}
