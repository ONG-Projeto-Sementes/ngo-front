import { Link } from 'react-router-dom';
import { Eye, Trash } from 'lucide-react';
import { ERoutes } from '@/types/ERoutes';
import type { VolunteerDTO } from '@/services/volunteer/getVolunteers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DesktopProps {
  isLoading: boolean;
  isDeleting: boolean;
  volunteers: VolunteerDTO[];
  remove: (id: string) => void;
  calculateAge: (birthDate: string) => number;
}

export default function Desktop({ isLoading, isDeleting, volunteers, remove, calculateAge }: DesktopProps) {
  return (
    <div className="hidden sm:block border rounded-lg border-gray-300">
      <Table className="pt-1">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center px-4">Foto</TableHead>
            <TableHead className="px-4">Nome</TableHead>
            <TableHead className="px-4">CPF</TableHead>
            <TableHead className="px-4">Contato</TableHead>
            <TableHead className="px-4">Nascimento</TableHead>
            <TableHead className="px-4">Idade</TableHead>
            <TableHead className="px-4">Cadastrado em</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array(8)
                    .fill(0)
                    .map((_, idx) => (
                      <TableCell key={idx} className="px-4">
                        <div
                          className={
                            idx === 0
                              ? 'h-8 w-8 bg-gray-200 rounded-full mx-auto animate-pulse'
                              : 'h-4 bg-gray-200 rounded animate-pulse'
                          }
                        />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            : volunteers.map((vol) => (
                <TableRow key={vol._id} className="align-middle">
                  <TableCell className="px-4 text-center align-middle">
                    <div className="flex justify-center items-center h-10">
                      <Avatar className="h-8 w-8">
                        {vol.profilePicture ? (
                          <AvatarImage src={vol.profilePicture} alt={vol.name} />
                        ) : (
                          <AvatarFallback>{vol.name.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 font-medium align-middle">{vol.name}</TableCell>
                  <TableCell className="px-4 align-middle">{vol.cpf ?? '—'}</TableCell>
                  <TableCell className="px-4 align-middle">{vol.contact ?? '—'}</TableCell>
                  <TableCell className="px-4 align-middle">
                    {vol.birthDate ? new Date(vol.birthDate).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                  <TableCell className="px-4 align-middle">
                    {vol.birthDate ? calculateAge(vol.birthDate) : '—'}
                  </TableCell>
                  <TableCell className="px-4 align-middle">
                    {new Date(vol.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="px-4 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`${ERoutes.VoluntariosEdicao}/${vol._id}`}>
                        <Eye className="w-5 h-5 text-primary hover:text-primary-dark cursor-pointer" />
                      </Link>
                      <button onClick={() => remove(vol._id)} disabled={isDeleting}>
                        <Trash className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
