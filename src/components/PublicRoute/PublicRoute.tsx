import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicRouteProps {
	children: JSX.Element;
}

export function PublicRoute({ children }: PublicRouteProps) {
	const { user, loading } = useAuth();

	if (loading) {
		return <div>Carregando...</div>;
	}

	if (user) {
		return <Navigate to="/" replace />;
	}

	return children;
}
