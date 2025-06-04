// src/api/user.ts
import type { AxiosError } from 'axios';
import { api } from './axios';

export interface SignInPayload {
	login: string;
	password: string;
}

export interface SignInResponse {
	token: string;
	user: {
		id: string;
		login: string;
		email: string;
	};
}

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
	try {
		const response = await api.post<SignInResponse>('/users/signin', payload);
		return response.data;
	} catch (err) {
		const error = err as AxiosError;
		console.error(error.response?.data || error.message);
		throw error;
	}
}
