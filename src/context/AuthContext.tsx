import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import logoutService from '../services/auth/logout';
import login, { type LoginRequest, type LoginResponse } from '../services/auth/login';
import { isAuthenticated, type AuthenticatedUser } from '../services/auth/authentication';

interface User {
	_id: string;
	username: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (payload: LoginRequest) => Promise<void>;
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
			setLoading(true);

			try {
				const session: AuthenticatedUser = await isAuthenticated();
				setUser({
					_id: session._id,
					username: session.username,
					email: session.email,
				});
				navigate('/login', { replace: true });
			} catch (err) {
				setUser(null);
				navigate('/login', { replace: true });
			} finally {
				setLoading(false);
			}
		}

		checkAuth();
	}, [navigate]);

	async function loginUser(payload: LoginRequest) {
		try {
			const res: LoginResponse = await login(payload);

			setUser({
				_id: res._id,
				username: res.username,
				email: res.email,
			});
			navigate('/inicio', { replace: true });
		} catch (err) {
			throw err;
		}
	}

	async function logoutUser() {
		try {
			await logoutService();
		} catch (err) {
		} finally {
			setUser(null);
			navigate('/login', { replace: true });
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login: loginUser,
				logout: logoutUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
