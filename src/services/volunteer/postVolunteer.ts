import apiClient from '@/helpers/request.ts';

export interface VolunteerResponse {
	__v: number;
	cpf?: string;
	_id: string;
	name: string;
	contact?: string;
	profilePicture?: string;
	birthDate?: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}

export async function postVolunteer(payload: FormData): Promise<VolunteerResponse> {
	try {
		const data = await apiClient.post<VolunteerResponse, FormData>('/volunteers', payload);
		return data;
	} catch (err) {
		const axiosErr = err as { response?: { data: { message?: string } } };
		if (axiosErr.response?.data?.message) {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}

export default postVolunteer;
