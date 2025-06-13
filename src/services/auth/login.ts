import axios from 'axios';
import { createApiClient } from '@/helpers/request.ts';
import type { RequestError } from '@/services/auth/authentication.ts';

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthenticationPayload {
	password: string;
	salt: string;
	sessionToken: string;
}

export interface LoginResponse {
	password: string;
	authentication: AuthenticationPayload;
	_id: string;
	username: string;
	email: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface InvalidCredentialsError {
	name: 'invalid_credentials';
	message: string;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
	try {
		const api = createApiClient();
		const data = await api.post<LoginResponse, LoginRequest>(
			'/auth/login',
			credentials,
		);
		return data;
	} catch (err) {
		const axiosErr = err as RequestError<InvalidCredentialsError>;
		if (axios.isAxiosError(axiosErr) && axiosErr.response?.data?.name === 'invalid_credentials') {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}

export default login;
