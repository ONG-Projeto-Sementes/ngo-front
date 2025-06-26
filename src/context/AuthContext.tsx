import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import loginService from '@/services/auth/login';
import logoutService from '@/services/auth/logout';
import { isAuthenticated } from '@/services/auth/authentication';
import type { AuthenticatedUser } from '@/services/auth/authentication';
import type { LoginRequest, LoginResponse } from '@/services/auth/login';

interface AuthContextType {
	user: AuthenticatedUser | null;
	isLoading: boolean;
	isPending: boolean;
	login: (payload: LoginRequest) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery<AuthenticatedUser | null, Error>({
		queryKey: ['auth', 'me'],
		queryFn: async () => {
			try {
				return await isAuthenticated();
			} catch {
				return null;
			}
		},
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
	});

	const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
		mutationFn: (creds) => loginService(creds),
		onSuccess: (data) => {
			const u: AuthenticatedUser = {
				_id: data._id,
				username: data.username,
				email: data.email,
			};
			queryClient.setQueryData(['auth', 'me'], u);
			navigate('/inicio', { replace: true });
		},
	});

	const logoutMutation = useMutation<void, Error>({
		mutationFn: () => logoutService(),
		onSuccess: () => {
			queryClient.setQueryData<AuthenticatedUser | null>(['auth', 'me'], null);
			navigate('/login', { replace: true });
		},
	});

	const login = async (payload: LoginRequest) => {
		await loginMutation.mutateAsync(payload);
	};
	const logout = async () => {
		await logoutMutation.mutateAsync();
	};

	return (
		<AuthContext.Provider
			value={{
				isPending: loginMutation.isPending || logoutMutation.isPending,
				user: user ?? null,
				isLoading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
	}
	return ctx;
}
