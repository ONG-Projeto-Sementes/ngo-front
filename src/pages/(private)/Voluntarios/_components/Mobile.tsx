import { Link } from 'react-router-dom';
import { Eye, Trash } from 'lucide-react';
import { ERoutes } from '@/types/ERoutes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { VolunteerDTO } from '@/services/volunteer/getVolunteers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MobileProps {
  isLoading: boolean;
  isDeleting: boolean;
  volunteers: VolunteerDTO[];
  remove: (id: string) => void;
  calculateAge: (birthDate: string) => number;
}

export default function Mobile({ isLoading, volunteers, remove, isDeleting, calculateAge }: MobileProps) {
  return (
    <div className="space-y-4 sm:hidden">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}

      {!isLoading &&
        volunteers.map((vol) => (
          <Card key={vol._id} className="border-gray-300">
            <CardHeader className="flex items-center gap-3">
              <Avatar>
                {vol.profilePicture ? (
                  <AvatarImage src={vol.profilePicture} alt={vol.name} />
                ) : (
                  <AvatarFallback>{vol.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h5 className="font-medium">{vol.name}</h5>
                <p className="text-sm text-gray-500">{vol.contact ?? '—'}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`${ERoutes.VoluntariosEdicao}/${vol._id}`}>
                  <Eye className="w-5 h-5 text-primary" />
                </Link>
                <button onClick={() => remove(vol._id)} disabled={isDeleting}>
                  <Trash className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                <strong>CPF:</strong> {vol.cpf ?? '—'}
              </p>
              <p>
                <strong>Nasc.:</strong> {vol.birthDate ? new Date(vol.birthDate).toLocaleDateString('pt-BR') : '—'} (
                <strong>{vol.birthDate ? calculateAge(vol.birthDate) : '—'} anos</strong>)
              </p>
              <p>
                <strong>Cadastrado em:</strong>{' '}
                {new Date(vol.createdAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </CardContent>
          </Card>
        ))}

      {!isLoading && volunteers.length === 0 && (
        <p className="text-center text-gray-500">Nenhum voluntário encontrado.</p>
      )}
    </div>
  );
}
