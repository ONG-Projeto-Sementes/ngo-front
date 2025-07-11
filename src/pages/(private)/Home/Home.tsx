import useQuery from '@/hooks/useQuery';
import { Sparkles } from 'lucide-react';
import { List } from './_components/EventList';
import { type EventResponse, getLastEvents } from '@/services/home/getLastEvents.ts';

export default function Home() {
	const { data, isLoading } = useQuery<EventResponse[]>({
		queryKey: ['event-list'],
		service: getLastEvents,
	});

	return (
		<>
			<div className="flex flex-col items-center justify-center text-center gap-6 h-full sm:mt-32 mx-4 sm:mx-0">
				<h2 className="relative">
					Inspire Vidas Todos os Dias
					<Sparkles className="absolute size-4 md:size-6 -right-3 -top-3 md:-right-6 md:-top-6"/>
				</h2>
				<p>Você faz a diferença, de um passo de cada vez.</p>
			</div>
			<div className="mt-8 sm:mt-24">
				<h3 className="mx-4">Eventos Recentes</h3>
				<List.Root>
					{isLoading ? (
						<>
							<List.Skeleton />
							<List.Skeleton />
							<List.Skeleton />
						</>
					) : data && data.length > 0 ? (
						data.map((item, index) => (
							<List.Item key={index} imageUrl={item.imageUrl} title={item.title} date={item.date} _id={item._id}/>
						))
					) : (
						<div className="col-span-full text-center py-8">
							<p className="text-gray-500">Nenhum evento encontrado ainda.</p>
							<p className="text-sm text-gray-400 mt-2">Os eventos criados aparecerão aqui.</p>
						</div>
					)}
				</List.Root>
			</div>
		</>
	);
}
