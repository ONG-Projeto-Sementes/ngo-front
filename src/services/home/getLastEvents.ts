// import apiClient from '@/helpers/request.ts';

export interface EventsResponse {
	imageUrl: string;
	title: string;
	date: string;
}

export async function getLastEvents(): Promise<EventsResponse[]> {
	// try {
	// 	const data = await apiClient.get<EventsResponse[]>('/event');
	// 	return data;
	// } catch (err) {
	// 	throw err;
	// }
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const MockData = [
		{
			imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
			title: 'Festival de Cultivo',
			date: '15/10/2023',
		},
		{
			imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
			title: 'Seminário sobre Sustentabilidade',
			date: '20/10/2023',
		},
		{
			imageUrl: '',
			title: 'Exposição de Alimentos Orgânicos',
			date: '25/10/2023',
		},
	];

	return MockData;
}

export default getLastEvents;
