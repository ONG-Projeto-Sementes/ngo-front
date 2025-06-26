import type { JSX } from 'react';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function PublicRoute({ children }: { children: JSX.Element }) {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="animate-spin" />
			</div>
		);
	}

	return user ? <Navigate to="/inicio" replace /> : children;
}
