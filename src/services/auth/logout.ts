import axios from 'axios';
import { post, type RequestError } from '../../helpers/request';

export interface UnauthenticatedError {
	name: 'unauthenticated';
	message: string;
}

export async function logout(): Promise<null> {
	try {
		return await post<null, void>('auth/logout');
	} catch (err) {
		const axiosErr = err as RequestError<UnauthenticatedError>;
		if (axios.isAxiosError(axiosErr) && axiosErr.response?.data?.name === 'unauthenticated') {
			throw new Error(axiosErr.response.data.message);
		}
		throw err;
	}
}

export default logout;
