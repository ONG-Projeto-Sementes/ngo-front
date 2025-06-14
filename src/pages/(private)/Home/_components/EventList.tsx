import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { EventListItemProps, EventListRootProps } from '../_types';

const EventListRoot = ({ children }: EventListRootProps) => {
	return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full p-4">{children}</div>;
};

const EventListItem = ({ imageUrl, title, date }: EventListItemProps) => {
	return (
		<div className="w-full cursor-pointer group transition-all duration-300 rounded-xl overflow-hidden hover:scale-[1.005] active:scale-[1.015]">
			<div className="relative h-[240px] w-full overflow-hidden">
				<img
					src={imageUrl || '/svg/default.svg'}
					alt={title || 'image-not-found'}
					loading="eager"
					className={cn(
						Boolean(!imageUrl) && 'opacity-25 cursor-not-allowed',
						`w-full h-full object-cover transition-all duration-300 group-hover:grayscale group-hover:brightness-75 group-hover:opacity-90`
					)}
				/>
			</div>
			<div className="p-4 transition-colors duration-300">
				<p className="font-semibold group-hover:text-black/70">{title}</p>
				<p className="text-sm group-hover:text-black/70">{date}</p>
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
