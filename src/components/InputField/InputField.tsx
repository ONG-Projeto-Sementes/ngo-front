import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface InputFieldProps<T extends FieldValues> {
	type?: string;
	label?: string;
	disabled?: boolean;
	name: FieldPath<T>;
	control: Control<T>;
	placeholder?: string;
}

export default function InputField<T extends FieldValues>({
	name,
	label,
	control,
	placeholder,
	type = 'text',
	disabled = false,
}: InputFieldProps<T>) {
	const [showPassword, setShowPassword] = useState(false);

	const isPassword = type === 'password';
	const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{Boolean(label) && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<div className={cn('relative', disabled && 'cursor-not-allowed')}>
							<Input
								{...field}
								type={inputType}
								placeholder={placeholder}
								disabled={disabled}
								className={cn('bg-white', isPassword && 'pr-10')}
							/>
							{isPassword && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => setShowPassword(!showPassword)}
									className={cn(
										'absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0',
										disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'
									)}
									tabIndex={-1}
									disabled={disabled}
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</Button>
							)}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
