import { Suspense, useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import type { MenuItemsType } from './_types';
import { ERoutes } from '../../types/ERoutes';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { List } from './_components/DropdownList';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    label: 'Início',
    to: ERoutes.Inicio,
  },
  {
    label: 'Doações',
    to: ERoutes.Doacoes,
  },
  {
    label: 'Eventos',
    to: ERoutes.Eventos,
  },
  {
    label: 'Voluntários',
    to: ERoutes.Voluntarios,
  },
  {
    label: 'Famílias',
    to: ERoutes.Familias,
  },
] as MenuItemsType[];

export default function AppLayout() {
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300 ease-in-out">
      <header className="bg-white">
        <div className="container mx-auto flex items-center justify-start gap-0 lg:gap-8 px-4 py-4">
          <Link to="/inicio" className="flex items-center min-w-[100px] md:min-w-[110px] lg:min-w-auto">
            <img src="/svg/logo.svg" alt="Logo" className="h-12 w-auto" />
          </Link>

          <nav className="hidden lg:flex sm:items-center gap-0 lg:gap-6">
            <Suspense
              fallback={<div>{menuItems.map((entry) => <List.Skeleton key={entry.label} />) as ReactNode[]}</div>}
            >
              <List.Root>
                {menuItems.map((entry) => (
                  <List.Item key={entry.label} label={entry.label} to={entry.to!} />
                ))}
              </List.Root>
            </Suspense>
          </nav>

          <span className="hidden lg:flex items-center ml-auto truncate gap-2">
            <p className="text-sm truncate">{user?.username ?? ''}</p>
            <Button
              variant="ghost"
              className="w-fit flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </span>

          <span className="lg:hidden flex items-center gap-2 ml-auto truncate">
            <p className="text-sm truncate">{user?.username ?? ''}</p>
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 cursor-pointer ml-auto"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </span>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white/90 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} />

          <div className="relative z-10 flex flex-col h-full safe-area-top safe-area-bottom px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Menu</h2>
              <span className="flex items-center gap-2">
                <p className="text-sm truncate">{user?.username ?? ''}</p>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-200"
                  aria-label="Fechar menu"
                >
                  <svg className="w-6 h-6 cursor-pointer" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            </div>

            <Suspense
              fallback={
                <List.MobileRoot>
                  {menuItems.map((entry) => (
                    <List.SkeletonMobile key={entry.label} />
                  ))}
                </List.MobileRoot>
              }
            >
              <List.MobileRoot className="flex flex-col gap-6">
                {menuItems.map((entry) => (
                  <List.ItemMobile
                    key={entry.label}
                    label={entry.label}
                    to={entry.to!}
                    className="text-xl font-medium hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                ))}
              </List.MobileRoot>
            </Suspense>

            <div className="mt-auto">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
