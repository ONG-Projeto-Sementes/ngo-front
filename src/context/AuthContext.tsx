import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { signIn, type SignInPayload, type SignInResponse } from '../api/users';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface User {
	_id: string;
	username: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (payload: SignInPayload) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	login: async () => {},
	logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function checkAuth() {
			try {
				const response = await api.get<User>('/auth/isAuthenticated');
				setUser(response.data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err: unknown) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		}
		checkAuth();

		function handleUnauthorized() {
			setUser(null);
			navigate('/login', { replace: true });
		}
		window.addEventListener('unauthorized', handleUnauthorized);

		return () => {
			window.removeEventListener('unauthorized', handleUnauthorized);
		};
	}, [navigate]);

	async function login(payload: SignInPayload) {
		const data: SignInResponse = await signIn(payload);
		const { _id, username, email } = data;
		setUser({ _id, username, email });
	}

	async function logout() {
		try {
			await api.post('/auth/logout');
		} catch {
			// ignore
		} finally {
			setUser(null);
			navigate('/login', { replace: true });
		}
	}

	return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	return useContext(AuthContext);
}
