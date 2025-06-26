export interface MenuItemsType {
	label: string;
	to: string;
}

export interface DropdownListRootProps {
	children: React.ReactNode;
	className?: string;
}


export interface DropdownListItemProps extends MenuItemsType {
	className?: string;
	onClick?: () => void;
}
