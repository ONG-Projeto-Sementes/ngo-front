import useQuery from '@/hooks/useQuery';
import type { EventResponse } from './_types';
import { List } from './_components/EventList';
import getLastEvents from '@/services/home/getLastEvents';

export default function Home() {
	const { data, isLoading } = useQuery<EventResponse[]>({
		queryKey: ['get-last-events'],
		service: getLastEvents,
	});

	return (
		<>
			<div className="flex flex-col items-center justify-center text-center gap-6 h-full sm:mt-32 mx-4 sm:mx-0">
				<h2>Inspire Vidas Todos os Dias</h2>
				<p>Você faz a diferença, de um passo de cada vez.</p>
			</div>
			<div className="mt-8 sm:mt-24">
				<h3 className="sm:mb-4 mx-4">Eventos Recentes</h3>
				<List.Root>
					{isLoading ? (
						<>
							<List.Skeleton />
							<List.Skeleton />
							<List.Skeleton />
						</>
					) : (
						data?.map((item, index) => (
							<List.Item key={index} imageUrl={item.imageUrl} title={item.title} date={item.date} />
						))
					)}
				</List.Root>
			</div>
		</>
	);
}
