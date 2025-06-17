import { Button } from '@/components/ui/button';
import { Undo2, UserRoundPlus } from 'lucide-react';
import { Card, CardTitle, CardAction, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import { useState } from 'react';
import useQuery from '@/hooks/useQuery';
import { Form } from '@/components/ui/form';
import InputField from '@/components/InputField/InputField';
import useSearchVolunteer from './_hooks/useSearchVolunteer';
import useRegisterVolunteer from './_hooks/useRegisterVolunteer';
import getVolunteers, { type VolunteersResponse } from '@/services/volunteer/getVolunteers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Voluntarios() {
	const [createVolunteer, setCreateVolunteer] = useState<boolean>(false);

	const { form: formSearch, onSubmit: onSubmitSearch } = useSearchVolunteer();
	const { form, isLoading: isLoadingRegister, onSubmit } = useRegisterVolunteer();

	const { data, isLoading } = useQuery<VolunteersResponse[]>({
		queryKey: ['volunteers'],
		service: () => getVolunteers(),
	});

	return (
		<div className="space-y-4 -mt-2">
			<Card>
				<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
					<div>
						<CardTitle className="text-2xl">Voluntários</CardTitle>
						<CardDescription>Gerencie todos os voluntários.</CardDescription>
					</div>
					<CardAction>
						<Button type="button" size="sm" onClick={() => setCreateVolunteer(!createVolunteer)}>
							{createVolunteer ? (
								<span className="flex items-center gap-2 text-sm">
									<Undo2 className="size-4" /> Voltar
								</span>
							) : (
								<span className="flex items-center gap-2 text-sm">
									<UserRoundPlus className="size-4" /> Cadastrar Voluntário
								</span>
							)}
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent className="-mt-5">
					{createVolunteer && (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mt-4">
								<div className="flex flex-col md:flex-row gap-3 w-full max-w-full">
									<div className="w-full">
										<InputField
											control={form.control}
											disabled={isLoadingRegister}
											label="Nome"
											name="name"
											type="text"
											width="w-full"
											placeholder="Digite o nome do voluntário"
										/>
									</div>
									<div className="w-full">
										<InputField
											control={form.control}
											disabled={isLoadingRegister}
											label="CPF"
											name="cpf"
											type="text"
											width="w-full"
											placeholder="000.000.000-00"
										/>
									</div>
									<div className="w-full">
										<InputField
											control={form.control}
											disabled={isLoadingRegister}
											label="Contato ou Email"
											name="contact"
											type="text"
											width="w-full"
											placeholder="(00) 00000-0000 ou email@exemplo.com"
										/>
									</div>
								</div>
								<Button
									type="submit"
									size="sm"
									className="w-fit mt-4 sm:mt-2"
									disabled={isLoadingRegister}
									isLoading={isLoadingRegister}
								>
									<UserRoundPlus className="size-4" /> Cadastrar
								</Button>
							</form>
						</Form>
					)}
					<Form {...formSearch}>
						<form
							onSubmit={formSearch.handleSubmit(onSubmitSearch)}
							className="flex flex-col md:flex-row items-center justify-center gap-3 w-full max-w-full md:max-w-sm mt-4"
						>
							<div className="w-full">
								<InputField
									control={formSearch.control}
									label="Busca Rápida"
									name="search"
									type="search"
									width="w-full"
									placeholder="Digite o nome, cpf ou contato"
								/>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			<div className="block md:hidden">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Voluntários</CardTitle>
						<CardDescription>Lista de todos voluntários.</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-4 -mt-2">
						{isLoading ? (
							Array.from({ length: 6 }).map((_, idx) => (
								<div
									key={idx}
									className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border border-gray-100 animate-pulse"
								>
									<div className="flex items-center justify-between">
										<div className="h-5 w-32 bg-gray-200 rounded" />
										<div className="h-3 w-16 bg-gray-200 rounded" />
									</div>
									<div className="flex flex-col gap-1">
										<div className="h-4 w-24 bg-gray-200 rounded" />
										<div className="h-4 w-20 bg-gray-200 rounded" />
									</div>
								</div>
							))
						) : (
							<>
								{data?.map((volunteer) => (
									<div
										key={volunteer._id}
										className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border border-gray-100"
									>
										<div className="flex items-center justify-between">
											<h3 className="text-lg font-semibold text-primary">{volunteer.name}</h3>
											<span className="text-xs text-gray-400">
												{volunteer.createdAt
													? (() => {
															const date = new Date(volunteer.createdAt);
															const day = String(date.getDate()).padStart(2, '0');
															const month = String(date.getMonth() + 1).padStart(2, '0');
															const year = date.getFullYear();
															const hours = String(date.getHours()).padStart(2, '0');
															const minutes = String(date.getMinutes()).padStart(2, '0');
															return `${day}/${month}/${year} ${hours}:${minutes}`;
														})()
													: ''}
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="text-sm text-gray-700">
												<strong>Contato:</strong> {volunteer.contact}
											</span>
											<span className="text-sm text-gray-700">
												<strong>CPF:</strong> {volunteer.cpf}
											</span>
										</div>
									</div>
								))}
								{!data?.length && (
									<div className="col-span-full text-center text-gray-400 py-8">Nenhum voluntário encontrado.</div>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="hidden md:block">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Voluntários</CardTitle>
						<CardDescription>Lista de todos voluntários.</CardDescription>
					</CardHeader>
					<CardContent className="-mt-2">
						{isLoading ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nome</TableHead>
										<TableHead>Contato</TableHead>
										<TableHead>CPF</TableHead>
										<TableHead>Cadastrado em</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.from({ length: 6 }).map((_, idx) => (
										<TableRow key={idx}>
											<TableCell>
												<div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
											</TableCell>
											<TableCell>
												<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
											</TableCell>
											<TableCell>
												<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
											</TableCell>
											<TableCell>
												<div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nome</TableHead>
											<TableHead>Contato</TableHead>
											<TableHead>CPF</TableHead>
											<TableHead>Cadastrado em</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{data?.map((volunteer) => (
											<TableRow key={volunteer._id}>
												<TableCell className="font-medium">{volunteer.name}</TableCell>
												<TableCell>{volunteer.contact}</TableCell>
												<TableCell>{volunteer.cpf}</TableCell>
												<TableCell>
													{volunteer.createdAt
														? (() => {
																const date = new Date(volunteer.createdAt);
																const day = String(date.getDate()).padStart(2, '0');
																const month = String(date.getMonth() + 1).padStart(2, '0');
																const year = date.getFullYear();
																const hours = String(date.getHours()).padStart(2, '0');
																const minutes = String(date.getMinutes()).padStart(2, '0');
																return `${day}/${month}/${year} ${hours}:${minutes}`;
															})()
														: ''}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								{!data?.length && <div className="text-center text-gray-400 py-8">Nenhum voluntário encontrado.</div>}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
