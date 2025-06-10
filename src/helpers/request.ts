import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

const BASE_URL: string =
	(typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
	(process.env.REACT_APP_API_BASE_URL as string) ||
	'http://localhost:8080';

const api: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	timeout: 15_000,
});

api.interceptors.request.use(
	(c) => c,
	(e) => Promise.reject(e)
);
api.interceptors.response.use(
	(r) => r,
	(e) => Promise.reject(e)
);

export interface RequestConfig<D = any> extends Omit<AxiosRequestConfig<D>, 'url'> {
	url: string;
}
export type RequestError<T = any> = AxiosError<T>;

export async function request<T = any, D = any>({ url, ...config }: RequestConfig<D>): Promise<T> {
	try {
		const resp = await api.request<T, AxiosResponse<T>, D>({ url, ...config });
		return resp.data;
	} catch (err) {
		if (axios.isAxiosError<T>(err)) throw err as RequestError<T>;
		throw err;
	}
}

export const get = <T = any, P = any>(url: string, params?: P) => request<T, P>({ url, method: 'GET', params });
export const post = <T = any, B = any>(url: string, data?: B) => request<T, B>({ url, method: 'POST', data });
export const put = <T = any, B = any>(url: string, data?: B) => request<T, B>({ url, method: 'PUT', data });
export const patch = <T = any, B = any>(url: string, data?: B) => request<T, B>({ url, method: 'PATCH', data });
export const del = <T = any, P = any>(url: string, params?: P) => request<T, P>({ url, method: 'DELETE', params });

export default request;
