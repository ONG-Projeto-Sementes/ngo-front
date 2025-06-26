import apiClient from '@/helpers/request.ts';
import type { RequestError } from '@/services/auth/authentication.ts';

export interface VolunteerDTO {
	_id: string;
	name: string;
	cpf?: string;
	contact?: string;
	birthDate?: string;
	profilePicture?: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export async function getVolunteer(id: string): Promise<VolunteerDTO> {
	try {
		return await apiClient.get<VolunteerDTO>(`/volunteers/${id}`);
	} catch (error) {
		const axiosErr = error as RequestError<{ name: string; message: string }>;
		if (axiosErr.response?.data?.message) {
			throw new Error(axiosErr.response.data.message);
		}
		throw error;
	}
}

export default getVolunteer;
