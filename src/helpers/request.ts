import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

export interface ICreateApiClient {
	get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse>;

	post<TResponse, TRequest = unknown>(url: string, body?: TRequest, config?: AxiosRequestConfig): Promise<TResponse>;

	put<TResponse, TRequest = unknown>(url: string, body: TRequest, config?: AxiosRequestConfig): Promise<TResponse>;

	patch<TResponse, TRequest = unknown>(url: string, body: TRequest, config?: AxiosRequestConfig): Promise<TResponse>;

	delete<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse>;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

const client: AxiosInstance = axios.create({
	baseURL: baseURL || 'http://localhost:8080',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

client.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => Promise.reject(error)
);

client.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error) => {
		const customError: AxiosError | undefined = error.response?.data;
		return Promise.reject(customError ?? error);
	}
);

const apiClient: ICreateApiClient = {
	get: async <TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> => {
		const resp = await client.get<TResponse>(url, config);
		return resp.data;
	},
	post: async <TResponse, TRequest = unknown>(
		url: string,
		body: TRequest,
		config?: AxiosRequestConfig
	): Promise<TResponse> => {
		const resp = await client.post<TResponse>(url, body, config);
		return resp.data;
	},
	patch: async <TResponse, TRequest = unknown>(
		url: string,
		body: TRequest,
		config?: AxiosRequestConfig
	): Promise<TResponse> => {
		const resp = await client.patch<TResponse>(url, body, config);
		return resp.data;
	},
	put: async <TResponse, TRequest = unknown>(
		url: string,
		body: TRequest,
		config?: AxiosRequestConfig
	): Promise<TResponse> => {
		const resp = await client.put<TResponse>(url, body, config);
		return resp.data;
	},
	delete: async <TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> => {
		const resp = await client.delete<TResponse>(url, config);
		return resp.data;
	},
};

export default apiClient;
