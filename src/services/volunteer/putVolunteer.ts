import apiClient from '@/helpers/request.ts';
import type { VolunteerResponse } from './postVolunteer';

export async function putVolunteer(id: string, payload: FormData): Promise<VolunteerResponse> {
	try {
		const data = await apiClient.put<VolunteerResponse, FormData>(`/volunteers/${id}`, payload);
		return data;
	} catch (err) {
		const axiosErr = err as { response?: { data: { message?: string } } };
		if (axiosErr.response?.data?.message) {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}

export default putVolunteer;
