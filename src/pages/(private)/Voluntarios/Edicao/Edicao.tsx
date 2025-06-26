'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';
import useMutation from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/InputField/InputField';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import putVolunteer from '@/services/volunteer/putVolunteer';
import getVolunteer from '../../../../services/volunteer/getVolunteer';
import type { VolunteerResponse } from '@/services/volunteer/postVolunteer';

// Form schema
const volunteerSchema = z.object({
	name: z.string().nonempty('Nome é obrigatório'),
	cpf: z.string().optional(),
	contact: z.string().optional(),
	birthDate: z.string().optional(),
	image: z
		.instanceof(FileList)
		.optional()
		.refine((list) => !list || list.length === 1, 'Envie apenas um arquivo'),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

export default function Edicao() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [preview, setPreview] = useState<string | null>(null);

	const form = useForm<VolunteerFormValues>({
		resolver: zodResolver(volunteerSchema),
		defaultValues: {
			name: '',
			cpf: '',
			contact: '',
			birthDate: '',
			image: undefined,
		},
	});

	const {
		isLoading: isLoadingVolunteer,
		data: volunteer,
		isError: isErrorVolunteer,
		error: fetchError,
	} = useQuery<VolunteerResponse, string>({
		queryKey: ['volunteer', id],
		service: () => getVolunteer(id!),
		queryHash: `volunteer-${id}`,
		autoStart: Boolean(id),
	});

	useEffect(() => {
		if (!volunteer) return;
		form.setValue('name', volunteer.name);
		form.setValue('cpf', volunteer.cpf ?? '');
		form.setValue('contact', volunteer.contact ?? '');
		form.setValue('birthDate', volunteer.birthDate ? volunteer.birthDate.slice(0, 10) : '');
		if (volunteer.profilePicture) setPreview(volunteer.profilePicture);
	}, [volunteer, form]);

	const { mutate, isPending } = useMutation<FormData, VolunteerResponse>((formData) => putVolunteer(id!, formData), {
		onError: (error) => {
			toast.error(error?.message ?? 'Erro ao atualizar voluntário.');
		},
		onSuccess: () => {
			toast.success('Voluntário atualizado com sucesso!');
			navigate('/voluntarios');
		},
	});

	const onSubmit = (values: VolunteerFormValues) => {
		const formData = new FormData();
		formData.append('name', values.name);
		if (values.cpf) formData.append('cpf', values.cpf);
		if (values.contact) formData.append('contact', values.contact);
		if (values.birthDate) formData.append('birthDate', values.birthDate);
		if (values.image && values.image.length > 0) {
			formData.append('image', values.image[0]);
		}
		mutate(formData);
	};

	if (isLoadingVolunteer) return <p>Carregando voluntário...</p>;
	if (isErrorVolunteer) return <p className="text-red-600">{fetchError?.message}</p>;

	return (
		<div className="max-w-lg mx-auto p-6">
			<div className="flex items-center mb-6">
				<Link to="/voluntarios" className="p-2 rounded hover:bg-gray-100 transition">
					<ChevronLeft className="h-5 w-5" />
				</Link>
				<h1 className="text-sm md:text-2xl font-semibold ml-2">Editar Voluntário</h1>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
					<InputField name="name" label="Nome" placeholder="Nome completo" control={form.control} />
					<InputField name="cpf" label="CPF" placeholder="123.456.789-00" control={form.control} />
					<InputField name="contact" label="Contato" placeholder="(XX) XXXXX-XXXX" control={form.control} />
					<InputField name="birthDate" label="Data de Nascimento" type="date" control={form.control} />

					<Controller
						name="image"
						control={form.control}
						render={({ field, fieldState }) => (
							<div>
								<label className="block text-sm font-medium mb-1">Avatar</label>
								<div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-4 items-center">
									<Avatar className="h-16 w-16">
										{preview ? (
											<AvatarImage src={preview} alt="Avatar Preview" />
										) : (
											<AvatarFallback>
												<User className="h-8 w-8 text-gray-400" />
											</AvatarFallback>
										)}
									</Avatar>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => {
											const files = e.target.files;
											field.onChange(files);
											if (files && files[0]) {
												setPreview(URL.createObjectURL(files[0]));
											}
										}}
										className="w-full sm:w-auto text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 px-2 py-1"
									/>
								</div>
								{fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
							</div>
						)}
					/>

					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? 'Atualizando...' : 'Salvar Alterações'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
