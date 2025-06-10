import axios from 'axios';
import { get, type RequestError } from '../../helpers/request';

export interface AuthenticatedUser {
	_id: string;
	username: string;
	email: string;
}

export interface UnauthenticatedError {
	name: 'unauthenticated';
	message: string;
}

export async function isAuthenticated(): Promise<AuthenticatedUser> {
	try {
		return await get<AuthenticatedUser>('auth/isAuthenticated');
	} catch (err) {
		const axiosErr = err as RequestError<UnauthenticatedError>;

		if (axios.isAxiosError(axiosErr) && axiosErr.response?.data?.name === 'unauthenticated') {
			throw new Error(axiosErr.response.data.message);
		}

		throw err;
	}
}
