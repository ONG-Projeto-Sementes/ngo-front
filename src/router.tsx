import { Loader2 } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ERoutes } from '@/types/ERoutes';
import AppLayout from '@/components/layouts/AppLayout';
import NotFound from '@/pages/(public)/Others/NotFound/NotFound';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { RequireAuth } from './components/RequireAuth/RequireAuth';

// Public pages
const Login = lazy(() => import('@/pages/(public)/Login/Login'));
// Private pages
const Home = lazy(() => import('@/pages/(private)/Home/Home'));
const Eventos = lazy(() => import('@/pages/(private)/Eventos/Eventos'));
const EventosCriar = lazy(() => import('@/pages/(private)/Eventos/Criar/Criar'));
const EventosEditar = lazy(() => import('@/pages/(private)/Eventos/Editar/Editar'));
const EventosDetalhes = lazy(() => import('@/pages/(private)/Eventos/Detalhes/Detalhes'));
const Familias = lazy(() => import('@/pages/(private)/Familias/Familias'));
const FamiliasCreate = lazy(() => import('@/pages/(private)/Familias/Criar/Criar'));
const FamiliasEdit = lazy(() => import('@/pages/(private)/Familias/Editar/Editar'));
const FamiliasBeneficiarios = lazy(() => import('@/pages/(private)/Familias/Beneficiarios/Beneficiarios'));
const FamiliasEditarBeneficiario = lazy(() => import('@/pages/(private)/Familias/EditarBeneficiario/EditarBeneficiario'));
const VoluntariosList = lazy(() => import('@/pages/(private)/Voluntarios/Voluntarios'));
const VoluntariosEdit = lazy(() => import('@/pages/(private)/Voluntarios/Edicao/Edicao'));
const VoluntariosCreate = lazy(() => import('@/pages/(private)/Voluntarios/Cadastrar/Cadastrar'));

// Donations pages
const Doacoes = lazy(() => import('@/pages/(private)/Doacoes/Doacoes'));
const DoacoesCategorias = lazy(() => import('@/pages/(private)/Doacoes/Categorias/Categorias'));
const AdminDoacoes = lazy(() => import('@/pages/(private)/Doacoes/AdminDoacoes/AdminDoacoes'));
const Analises = lazy(() => import('@/pages/(private)/Doacoes/Analises/Analises'));

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

        {/* Public routes */}
        <Route
          path={ERoutes.Login}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Private routes */}
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path={ERoutes.Inicio} element={<Home />} />
          <Route path={ERoutes.Eventos} element={<Eventos />} />
          <Route path={ERoutes.EventosCriar} element={<EventosCriar />} />
          <Route path={`${ERoutes.EventosEditar}/:id`} element={<EventosEditar />} />
          <Route path={`${ERoutes.EventosDetalhes}/:id`} element={<EventosDetalhes />} />

          {/* Voluntários routes */}
          <Route path={ERoutes.Voluntarios} element={<VoluntariosList />} />
          <Route path={ERoutes.VoluntariosCadastro} element={<VoluntariosCreate />} />
          <Route path={`${ERoutes.VoluntariosEdicao}/:id`} element={<VoluntariosEdit />} />

          {/* Famílias routes */}
          <Route path={ERoutes.Familias} element={<Familias />} />
          <Route path={ERoutes.FamiliasCriar} element={<FamiliasCreate />} />
          <Route path={`${ERoutes.FamiliasEditar}/:id`} element={<FamiliasEdit />} />
          <Route path="/familias/:id/beneficiarios" element={<FamiliasBeneficiarios />} />
          <Route path="/familias/:familyId/beneficiarios/:beneficiaryId/editar" element={<FamiliasEditarBeneficiario />} />


          {/* Donations routes */}
          <Route path={ERoutes.Doacoes} element={<Doacoes />} />
          <Route path={ERoutes.DoacoesCategorias} element={<DoacoesCategorias />} />
          <Route path={ERoutes.DoacoesAnalytics} element={<Analises />} />
          <Route path={ERoutes.DoacoesAdmin} element={<AdminDoacoes />} />
        </Route>

        {/* Fallback for unmatched */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
