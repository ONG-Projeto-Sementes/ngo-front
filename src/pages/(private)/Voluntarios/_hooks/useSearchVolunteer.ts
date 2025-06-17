import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const searchVolunteerSchema = z.object({
	search: z.string().min(1, 'Digite algo para buscar'),
});

export type SearchVolunteerFormData = z.infer<typeof searchVolunteerSchema>;

export default function useSearchVolunteer() {
	const form = useForm<SearchVolunteerFormData>({
		resolver: zodResolver(searchVolunteerSchema),
		defaultValues: { search: '' },
	});

	const onSubmit = (data: SearchVolunteerFormData) => {
		console.log('Busca:', data.search);
	};

	return {
		form,
		onSubmit,
	};
}
