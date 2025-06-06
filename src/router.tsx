import LoginPage from './pages/login/Login';
import InicioPage from './pages/inicio/Inicio';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
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
            <LoginPage />
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
        <Route path="/inicio" element={<InicioPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
