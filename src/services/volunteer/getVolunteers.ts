import apiClient from '@/helpers/request.ts';
import type { RequestError } from '@/services/auth/authentication.ts';

export interface VolunteersResponse {
	_id: string;
	__v: number;
	cpf: string;
	name: string;
	contact: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface InvalidCredentialsError {
	name: string;
	message: string;
}

export async function getVolunteers(): Promise<VolunteersResponse[]> {
	try {
		return await apiClient.get<VolunteersResponse[]>('/volunteers');
	} catch (err) {
		const axiosErr = err as RequestError<InvalidCredentialsError>;
		if (axiosErr.response?.data?.name) {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}

export default getVolunteers;
