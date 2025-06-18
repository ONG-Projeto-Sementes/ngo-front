import { cn } from '@/lib/utils';
import usePathName from '@/helpers/usePathName';
import { Skeleton } from '@/components/ui/skeleton';
import type { DropdownListItemProps, DropdownListRootProps } from '../_types';
import { Link } from 'react-router-dom';

const DropdownListRoot = ({ children }: DropdownListRootProps) => {
	return <div className="flex gap-3">{children}</div>;
};

const DropdownListListItem = ({ label, to }: DropdownListItemProps) => {
	const path = usePathName();
	return (
		<Link to={to} className="relative flex items-center justify-center">
			<div className="relative cursor-pointer p-2 rounded-lg transition-colors animation-in duration-300">
				<p
					className={cn(
						path.includes(to) ? 'text-accent' : 'hover:text-accent',
						'text-md font-sans transition-all',
					)}
				>
					{label}
				</p>
			</div>
		</Link>
	);
};

const DropdownListMobileRoot = ({ children }: DropdownListRootProps) => {
	return <div className="flex flex-col w-full">{children}</div>;
};

const DropdownListListItemMobile = ({ label, to }: DropdownListItemProps) => {
	const path = usePathName();
	const isActive = path.includes(to);
	return (
		<Link to={to} className="relative flex flex-col items-center justify-center w-full">
			<div className="relative cursor-pointer p-2 rounded-lg transition-colors w-screen">
				<p className={cn(isActive && '', 'text-center text-md font-sans transition-all')}>{label}</p>
			</div>
			<hr className={cn('w-full border-t', isActive ? 'border-primary' : 'border-gray-200')} />
		</Link>
	);
};

const DropdownListSkeletonMobile = () => {
	return (
		<div className="relative p-2 rounded-lg">
			<Skeleton className="h-5 w-24 mb-2" />
			<div className="absolute left-0 -top-10 h-full w-full rounded-lg bg-primary opacity-30" />
		</div>
	);
};

const DropdownListSkeleton = () => {
	return (
		<div className="relative p-2 rounded-lg">
			<Skeleton className="h-5 w-24 mb-2" />
			<div className="absolute left-0 -top-10 h-full w-full rounded-lg bg-primary opacity-30" />
		</div>
	);
};

export const List = {
	Root: DropdownListRoot,
	Item: DropdownListListItem,
	Skeleton: DropdownListSkeleton,
	MobileRoot: DropdownListMobileRoot,
	ItemMobile: DropdownListListItemMobile,
	SkeletonMobile: DropdownListSkeletonMobile,
};
