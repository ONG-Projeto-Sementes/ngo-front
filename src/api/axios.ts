import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.exemplo.com',
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 5000,
});

// Interceptor de request inserir token ou outro header
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Interceptor de response tratar erros
// TODO: Implementar logica de tratamento de error para enviar para toast esse local serve somente para tratar o erro nada muito complexo
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// logout logic...
		}
		return Promise.reject(error);
	}
);
