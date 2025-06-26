import axios from 'axios';
import apiClient from '@/helpers/request.ts';
import type { RequestError } from '@/services/auth/authentication.ts';

export interface UnauthenticatedError {
	name: 'unauthenticated';
	message: string;
}

export async function logout(): Promise<void> {
	try {
		await apiClient.post<null, void>('/auth/logout');
	} catch (err) {
		const axiosErr = err as RequestError<UnauthenticatedError>;
		if (axios.isAxiosError(axiosErr) && axiosErr.response?.data?.name === 'unauthenticated') {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}

export default logout;
