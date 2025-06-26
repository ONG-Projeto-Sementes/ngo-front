import type { JSX } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export function RequireAuth({ children }: { children: JSX.Element }) {
	const { user, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="animate-spin" />
			</div>
		);
	}

	return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
