import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface InputFieldProps<T extends FieldValues> {
	type?: string;
	label?: string;
	width?: string;
	disabled?: boolean;
	name: FieldPath<T>;
	control: Control<T>;
	placeholder?: string;
}
