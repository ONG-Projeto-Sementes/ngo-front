import apiClient from '@/helpers/request.ts';

interface BackendEventResponse {
	_id: string;
	title: string;
	image?: string;
	startDate: string;
}

export interface EventResponse {
	_id: string;
	imageUrl?: string;
	title: string;
	date: string;
}

export async function getLastEvents(): Promise<EventResponse[]> {
	try {
		const data = await apiClient.get<BackendEventResponse[]>('/events/last');
		
		// Se não houver eventos, retorna array vazio
		if (!data || data.length === 0) {
			return [];
		}
		
		// Transformar os dados do backend para o formato esperado pelo frontend
		return data.map(event => ({
			_id: event._id,
			imageUrl: event.image || '', // Usar imagem do evento ou vazio para fallback
			title: event.title,
			date: new Date(event.startDate).toLocaleDateString('pt-BR') // Formatar data
		}));
	} catch (error) {
		console.error('Erro ao buscar últimos eventos:', error);
		// Retorna array vazio em caso de erro
		return [];
	}
}