export interface MenuItemsType {
	label: string;
	to: string;
}

export interface DropdownListRootProps {
	children: React.ReactNode;
}

export interface DropdownListItemProps extends MenuItemsType {}
