import type { JSX } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
	children: JSX.Element;
}

export function RequireAuth({ children }: RequireAuthProps) {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return <div>Carregando...</div>;
	}

	return !user ? <Navigate to="/login" state={{ from: location }} replace /> : children;
}
