import type { ReactNode } from "react";

export interface EventListRootProps {
	children: ReactNode;
}

export interface EventListItemProps {
	_id: string;
	imageUrl: string;
	title: string;
	date: string;
}

export interface EventResponse extends EventListItemProps {}