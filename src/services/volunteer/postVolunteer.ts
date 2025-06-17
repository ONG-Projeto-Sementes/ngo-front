import apiClient from '@/helpers/request.ts';
import type { RequestError } from '@/services/auth/authentication.ts';

export interface VolunteerRequest {
	cpf: string;
	name: string;
	contact: string;
}

export interface VolunteerResponse {
	__v: number;
	cpf: string;
	_id: string;
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

export async function postVolunteer(payload: VolunteerRequest): Promise<VolunteerResponse> {
	try {
		const data = await apiClient.post<VolunteerResponse, VolunteerRequest>('/volunteers', payload);
		return data;
	} catch (err) {
		const axiosErr = err as RequestError<InvalidCredentialsError>;
		if (axiosErr.response?.data?.name) {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}

export default postVolunteer;
