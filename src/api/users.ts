import { api } from './axios';
import type { AxiosError } from 'axios';

export interface SignInPayload {
	email: string;
	password: string;
}

export interface SignInResponse {
	authentication: {
		password: string;
		salt: string;
		sessionToken: string;
	};
	_id: string;
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
	try {
		const response = await api.post<SignInResponse>('/auth/login', payload);
		return response.data;
	} catch (err) {
		const error = err as AxiosError;
		console.error(error.response?.data || error.message);
		throw error;
	}
}
