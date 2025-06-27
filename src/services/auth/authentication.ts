import axios, { AxiosError } from 'axios';
import apiClient from '@/helpers/request.ts';

export interface AuthenticatedUser {
	_id: string;
	username: string;
	email: string;
}

export interface UnauthenticatedError {
	name: 'unauthenticated';
	message: string;
}

export type RequestError<T = Error | null> = AxiosError<T>;

export async function isAuthenticated(): Promise<AuthenticatedUser> {
	try {
		return apiClient.get<AuthenticatedUser>('/auth/isAuthenticated');
	} catch (err) {
		const axiosErr = err as RequestError<UnauthenticatedError>;
		if (axios.isAxiosError(axiosErr) && axiosErr.response?.data?.name === 'unauthenticated') {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}
