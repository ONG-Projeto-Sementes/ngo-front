import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface PublicRouteProps {
	children: JSX.Element;
}

export function PublicRoute({ children }: PublicRouteProps) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="size-4 animate-spin" />
			</div>
		);
	}

	if (user) {
		return <Navigate to="/" replace />;
	}

	return children;
}
