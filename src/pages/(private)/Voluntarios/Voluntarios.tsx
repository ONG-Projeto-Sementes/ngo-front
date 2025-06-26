import { Link } from 'react-router-dom';
import useQuery from '@/hooks/useQuery';
import { Eye, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import getVolunteers, { type VolunteersResponse } from '@/services/volunteer/getVolunteers';
import { Table, TableRow, TableHead, TableBody, TableCell, TableHeader } from '@/components/ui/table';

export default function Voluntarios() {
	const { data: volunteers, isLoading } = useQuery<VolunteersResponse[]>({
		queryKey: ['volunteers'],
		service: getVolunteers,
	});

	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		if (!volunteers) return [];
		const term = search.toLowerCase();
		return volunteers.filter((vol) => {
			return [
				vol.name,
				vol.cpf,
				vol.contact,
				vol.birthDate ? new Date(vol.birthDate).toLocaleDateString('pt-BR') : '',
				new Date(vol.createdAt).toLocaleString('pt-BR', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				}),
			]
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
					<input
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Buscar por nome, CPF, contato, data..."
						className="w-full md:w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

			<div className="hidden md:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-1/12">Foto</TableHead>
							<TableHead className="w-2/12">Nome</TableHead>
							<TableHead className="w-2/12">CPF</TableHead>
							<TableHead className="w-2/12">Contato</TableHead>
							<TableHead className="w-2/12">Nascimento</TableHead>
							<TableHead className="w-2/12">Cadastrado em</TableHead>
							<TableHead className="w-1/12 text-center">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading &&
							Array.from({ length: 5 }).map((_, idx) => (
								<TableRow key={idx}>
									<TableCell>
										<div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
									</TableCell>
									{[...Array(5)].map((_, i) => (
										<TableCell key={i}>
											<div className="h-4 bg-gray-200 rounded animate-pulse" />
										</TableCell>
									))}
									<TableCell>
										<div className="h-6 w-6 bg-gray-200 rounded animate-pulse mx-auto" />
									</TableCell>
								</TableRow>
							))}

						{!isLoading && filtered.length
							? filtered.map((vol) => (
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
										<TableCell>
											{new Date(vol.createdAt).toLocaleString('pt-BR', {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
											})}
										</TableCell>
										<TableCell className="text-center">
											<Link to={`/volunteers/${vol._id}`}>
												<Eye className="h-5 w-5 text-blue-600 hover:text-blue-800 mx-auto" />
											</Link>
										</TableCell>
									</TableRow>
								))
							: null}

						{!isLoading && !filtered.length && (
							<TableRow>
								<TableCell colSpan={7} className="text-center text-gray-500 py-4">
									Nenhum voluntário encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-4 md:hidden">
				{!isLoading && filtered.length
					? filtered.map((vol) => (
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
										<h2 className="text-lg font-semibold">{vol.name}</h2>
									</div>
									<Link to={`/volunteers/${vol._id}`}>
										<Eye className="h-6 w-6 text-blue-600 hover:text-blue-800" />
									</Link>
								</div>
								<p className="text-sm">
									<strong>CPF:</strong> {vol.cpf ?? '—'}
								</p>
								<p className="text-sm">
									<strong>Contato:</strong> {vol.contact ?? '—'}
								</p>
								<p className="text-sm">
									<strong>Nascimento:</strong>{' '}
									{vol.birthDate ? new Date(vol.birthDate).toLocaleDateString('pt-BR') : '—'}
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
						))
					: null}

				{!isLoading && !filtered.length && (
					<div className="text-center text-gray-500 py-4">Nenhum voluntário encontrado.</div>
				)}
			</div>
		</div>
	);
}
