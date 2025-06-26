import { Loader2 } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { ERoutes } from '@/types/ERoutes'
import AppLayout from '@/components/layouts/AppLayout'
import NotFound from '@/pages/(public)/Others/NotFound/NotFound'
import { PublicRoute } from './components/PublicRoute/PublicRoute'
import { RequireAuth } from './components/RequireAuth/RequireAuth'

// Public pages
const Login = lazy(() => import('@/pages/(public)/Login/Login'))
// Private pages
const Home = lazy(() => import('@/pages/(private)/Home/Home'))
const Doacoes = lazy(() => import('@/pages/(private)/Doacoes/Doacoes'))
const Eventos = lazy(() => import('@/pages/(private)/Eventos/Eventos'))
const Recebimentos = lazy(() => import('@/pages/(private)/Recebimentos/Recebimentos'))
const VoluntariosList = lazy(() => import('@/pages/(private)/Voluntarios/Voluntarios'))
const VoluntariosEdit = lazy(() => import('@/pages/(private)/Voluntarios/Edicao/Edicao'))
const Beneficiarios = lazy(() => import('@/pages/(private)/Beneficiarios/Beneficiarios'))
const VoluntariosCreate = lazy(() => import('@/pages/(private)/Voluntarios/Cadastrar/Cadastrar'))

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
          <Route path={ERoutes.Doacoes} element={<Doacoes />} />
          <Route path={ERoutes.Eventos} element={<Eventos />} />

          {/* Voluntários routes */}
          <Route path={ERoutes.Voluntarios} element={<VoluntariosList />} />
          <Route path={`${ERoutes.Voluntarios}/cadastro`} element={<VoluntariosCreate />} />
          <Route path={`${ERoutes.Voluntarios}/:id`} element={<VoluntariosEdit />} />

          <Route path={ERoutes.Recebimentos} element={<Recebimentos />} />
          <Route path={ERoutes.Beneficiarios} element={<Beneficiarios />} />
        </Route>

        {/* Fallback for unmatched */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
