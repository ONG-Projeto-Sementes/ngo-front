export interface EventResponse {
	_id: string;
	imageUrl: string;
	title: string;
	date: string;
}

export async function getLastEvents(): Promise<EventResponse[]> {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const MockData = [
		{
			_id: '001',
			imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
			title: 'Festival de Cultivo',
			date: '15/10/2023',
		},
		{
			_id: '002',
			imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
			title: 'Seminário sobre Sustentabilidade',
			date: '20/10/2023',
		},
		{
			_id: '003',
			imageUrl: '',
			title: '',
			date: '',
		},
	];

	return MockData;
}