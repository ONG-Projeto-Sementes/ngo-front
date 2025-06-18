import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { EventListItemProps, EventListRootProps } from '../_types';
import { useState } from 'react';

const EventListRoot = ({ children }: EventListRootProps) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full p-4">
			{children}
		</div>
	);
};

const EventListItem = ({ imageUrl, title, date, _id }: EventListItemProps) => {
	const [loaded, setLoaded] = useState(false);
	const [src, setSrc] = useState(imageUrl || '/svg/default.svg');

	return (
		<div
			className={cn((Boolean(_id) || Boolean(imageUrl) || Boolean(title) || Boolean(date)) ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.005] active:scale-[1.015]', `w-full group transition-all duration-300 rounded-xl overflow-hidden`)}>
			<div className="relative h-[240px] w-full overflow-hidden">
				{!loaded && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-200">
						<Skeleton className="h-full w-full" />
					</div>
				)}
				<img
					src={src}
					alt={title || 'image-not-found'}
					loading="eager"
					onLoad={() => setLoaded(true)}
					onError={() => {
						if (src !== '/svg/default.svg') {
							setSrc('/svg/default.svg');
						} else {
							setLoaded(true);
						}
					}}
					className={cn(
						`w-full h-full object-cover transition-all duration-300 group-hover:grayscale group-hover:brightness-75 group-hover:opacity-90`,
						src === '/svg/default.svg' && 'opacity-25 cursor-not-allowed',
					)}
				/>
			</div>

			<div className="p-4 transition-colors duration-300">
				{title ? (
					<p className="font-semibold group-hover:text-black/70">{title}</p>
				) : (
					<p className="text-gray-500">Título indisponível</p>
				)}

				{date ? (
					<p className="text-sm group-hover:text-black/70">{date}</p>
				) : (
					<p className="text-gray-400">Data indisponível</p>
				)}
			</div>
		</div>
	);
};

const EventListSkeleton = () => {
	return (
		<div className="w-full">
			<Skeleton className="h-[240px] w-full rounded-t-xl" />
			<div className="p-4 space-y-4">
				<Skeleton className="h-5 w-3/6" />
				<Skeleton className="h-4 w-1/3" />
			</div>
		</div>
	);
};

export const List = {
	Root: EventListRoot,
	Item: EventListItem,
	Skeleton: EventListSkeleton,
};