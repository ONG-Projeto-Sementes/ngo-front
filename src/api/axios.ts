import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 5000,
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 || error.response?.status === 403) {
			window.dispatchEvent(new Event('unauthorized'));
		}
		return Promise.reject(error);
	}
);
