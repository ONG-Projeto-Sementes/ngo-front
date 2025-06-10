import type { JSX } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
	children: JSX.Element;
}

export function RequireAuth({ children }: RequireAuthProps) {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div>
				<div className="flex items-center justify-center h-screen">
					<Loader2 className="size-4 animate-spin" />
				</div>
			</div>
		);
	}

	return !user ? <Navigate to="/login" state={{ from: location }} replace /> : children;
}
