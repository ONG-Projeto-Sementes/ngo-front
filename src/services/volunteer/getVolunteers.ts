import apiClient from '@/helpers/request.ts';
import type { RequestError } from '@/services/auth/authentication.ts';

export interface VolunteersResponse {
  _id: string
  name: string
  cpf?: string
  contact?: string
  birthDate?: string
  profilePicture?: string
  deleted: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}


export interface InvalidCredentialsError {
	name: string;
	message: string;
}

export async function getVolunteers(): Promise<VolunteersResponse[]> {
	try {
		return await apiClient.get<VolunteersResponse[]>('/volunteers');
	} catch (error) {
		const axiosErr = error as RequestError<InvalidCredentialsError>;
		if (axiosErr.response?.data?.name) {
			throw new Error(axiosErr.response.data.message);
		}
		throw error;
	}
}

export default getVolunteers;
