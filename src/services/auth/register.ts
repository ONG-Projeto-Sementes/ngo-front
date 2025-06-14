import axios from 'axios';
import apiClient from '@/helpers/request.ts';
import type { RequestError } from '@/services/auth/authentication.ts';

export interface RegisterRequest {
	email: string;
	password: string;
	username: string;
}

export interface AuthenticationPayload {
	password: string;
	salt: string;
}

export interface RegisterResponse {
	username: string;
	email: string;
	authentication: AuthenticationPayload;
	deleted: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface ValidationErrorPayload {
	name: 'ValidationError';
	message: string;
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
	try {
		return apiClient.post<RegisterResponse, RegisterRequest>('/auth/register', data);
	} catch (err) {
		const axiosErr = err as RequestError<ValidationErrorPayload>;
		if (axios.isAxiosError(axiosErr) && axiosErr.response?.data?.name === 'ValidationError') {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}

export default register;
