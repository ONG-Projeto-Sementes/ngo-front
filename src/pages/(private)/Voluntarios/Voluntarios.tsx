import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, Trash } from 'lucide-react';
import useQuery from '@/hooks/useQuery';
import useMutation from '@/hooks/useMutation';
import { toast } from 'sonner';
import getVolunteers, { type VolunteerDTO } from '@/services/volunteer/getVolunteers';
import deleteVolunteer from '@/services/volunteer/deleteVolunteer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function calculateAge(birthDate: string): number {
	const birth = new Date(birthDate);
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age >= 0 ? age : 0;
}

export default function Voluntarios() {
	const {
		data: volunteers,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery<VolunteerDTO[]>({
		queryKey: ['volunteers'],
		service: getVolunteers,
	});

	const { mutate: remove, isPending: isDeleting } = useMutation<string, void>((id) => deleteVolunteer(id), {
		onSuccess: () => {
			toast.success('Voluntário deletado com sucesso!');
			refetch();
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao deletar voluntário');
		},
	});

	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		if (!volunteers) return [];
		const term = search.toLowerCase();
		return volunteers.filter((vol) => {
			const birth = vol.birthDate ? new Date(vol.birthDate).toLocaleDateString('pt-BR') : '';
			const created = new Date(vol.createdAt).toLocaleString('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
			const age = vol.birthDate ? calculateAge(vol.birthDate).toString() : '—';
			return [vol.name, vol.cpf, vol.contact, birth, created, age]
				.filter(Boolean)
				.join(' ')
				.toLowerCase()
				.includes(term);
		});
	}, [volunteers, search]);

	return (
		<div className="p-4">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
				<h1 className="text-2xl font-semibold">Voluntários</h1>
				<div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
					<Input
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Buscar por nome, CPF, contato, idade..."
						className="w-full md:w-64"
					/>
					<Link
						to="/voluntarios/cadastro"
						className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
					>
						<Plus className="w-4 h-4" />
						Cadastrar
					</Link>
				</div>
			</div>

			{isError && (
				<div className="text-red-500 my-4">
					<p>Erro ao carregar voluntários: {(error as Error).message}</p>
					<Button onClick={() => refetch()}>Tentar novamente</Button>
				</div>
			)}

			<div className="hidden md:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Foto</TableHead>
							<TableHead>Nome</TableHead>
							<TableHead>CPF</TableHead>
							<TableHead>Contato</TableHead>
							<TableHead>Nascimento</TableHead>
							<TableHead>Idade</TableHead>
							<TableHead>Cadastrado em</TableHead>
							<TableHead className="text-center">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading &&
							Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i}>
									<TableCell>
										<div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
									</TableCell>
									{[...Array(6)].map((_, j) => (
										<TableCell key={j}>
											<div className="h-4 bg-gray-200 rounded animate-pulse" />
										</TableCell>
									))}
									<TableCell>
										<div className="h-6 w-6 bg-gray-200 rounded animate-pulse mx-auto" />
									</TableCell>
								</TableRow>
							))}

						{!isLoading &&
							filtered.map((vol) => (
								<TableRow key={vol._id}>
									<TableCell>
										<Avatar>
											{vol.profilePicture ? (
												<AvatarImage src={vol.profilePicture} alt={vol.name} />
											) : (
												<AvatarFallback>{vol.name.charAt(0).toUpperCase()}</AvatarFallback>
											)}
										</Avatar>
									</TableCell>
									<TableCell className="font-medium">{vol.name}</TableCell>
									<TableCell>{vol.cpf ?? '—'}</TableCell>
									<TableCell>{vol.contact ?? '—'}</TableCell>
									<TableCell>{vol.birthDate ? new Date(vol.birthDate).toLocaleDateString('pt-BR') : '—'}</TableCell>
									<TableCell>{vol.birthDate ? calculateAge(vol.birthDate) : '—'}</TableCell>
									<TableCell>
										{new Date(vol.createdAt).toLocaleString('pt-BR', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</TableCell>
									<TableCell className="text-center flex items-center justify-center gap-2">
										<Link to={`/voluntarios/${vol._id}`}>
											<Eye className="h-5 w-5 text-primary hover:text-primary-dark" />
										</Link>
										<button
											onClick={() => remove(vol._id)}
											disabled={isDeleting}
											className="inline-flex items-center justify-center p-1 rounded hover:bg-red-100 cursor-pointer"
										>
											<Trash className="h-5 w-5 text-red-600 hover:text-red-800" />
										</button>
									</TableCell>
								</TableRow>
							))}

						{!isLoading && filtered.length === 0 && (
							<TableRow>
								<TableCell colSpan={8} className="text-center text-gray-500 py-4">
									Nenhum voluntário encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Mobile */}
			<div className="flex flex-col gap-4 md:hidden bg-white">
				{!isLoading &&
					filtered.map((vol) => (
						<div key={vol._id} className="border rounded-lg p-4 shadow flex flex-col">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center space-x-4">
									<Avatar className="h-12 w-12">
										{vol.profilePicture ? (
											<AvatarImage src={vol.profilePicture} alt={vol.name} />
										) : (
											<AvatarFallback>{vol.name.charAt(0).toUpperCase()}</AvatarFallback>
										)}
									</Avatar>
									<div>
										<h2 className="text-sm font-semibold">{vol.name}</h2>
										<p className="text-sm text-gray-600">Idade: {vol.birthDate ? calculateAge(vol.birthDate) : '—'}</p>
									</div>
								</div>
								<div className="flex flex-col items-center gap-2">
									<Link to={`/voluntarios/${vol._id}`}>
										<Eye className="h-6 w-6 text-primary hover:text-primary-dark  cursor-pointer" />
									</Link>
									<button
										onClick={() => remove(vol._id)}
										disabled={isDeleting}
										className="p-1 rounded hover:bg-red-100  cursor-pointer"
									>
										<Trash className="h-6 w-6 text-red-600 hover:text-red-800" />
									</button>
								</div>
							</div>
							<p className="text-sm">
								<strong>CPF:</strong> {vol.cpf ?? '—'}
							</p>
							<p className="text-sm">
								<strong>Contato:</strong> {vol.contact ?? '—'}
							</p>
							<p className="text-sm">
								<strong>Nascimento:</strong> {vol.birthDate ? new Date(vol.birthDate).toLocaleDateString('pt-BR') : '—'}
							</p>
							<p className="text-sm text-gray-500 mt-2">
								Cadastrado em:{' '}
								{new Date(vol.createdAt).toLocaleString('pt-BR', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
								})}
							</p>
						</div>
					))}

				{!isLoading && filtered.length === 0 && (
					<div className="text-center text-gray-500 py-4">Nenhum voluntário encontrado.</div>
				)}
			</div>
		</div>
	);
}
