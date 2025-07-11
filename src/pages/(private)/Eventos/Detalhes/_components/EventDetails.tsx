import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Edit, UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getEvent } from '@/services/events';
import { useManageEventVolunteers } from '../../_hooks/useManageEventVolunteers';
import VolunteerSelection from './VolunteerSelection';

interface Props {
  eventId: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventDetails({ eventId }: Props) {
  const [showVolunteerSelection, setShowVolunteerSelection] = useState(false);

  const { data: event, isLoading, error, refetch } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
  });

  const { addVolunteer, removeVolunteer, isRemoving } = useManageEventVolunteers(refetch);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 mt-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <Card className="max-w-4xl mx-auto mt-6">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar evento: {(error as Error)?.message || 'Evento não encontrado'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEventPast = new Date(event.startDate) < new Date();
  const volunteersCount = event.volunteers.length;
  const maxVolunteers = event.maxVolunteers;
  const canAddVolunteers = !maxVolunteers || volunteersCount < maxVolunteers;

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6">
      {/* Informações Principais */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                {isEventPast && <Badge variant="secondary">Finalizado</Badge>}
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {volunteersCount}{maxVolunteers ? `/${maxVolunteers}` : ''} voluntários
                </Badge>
              </div>
            </div>
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="w-32 h-32 object-cover rounded-lg ml-6"
              />
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Início</p>
                  <p className="text-sm">{formatDate(event.startDate)}</p>
                </div>
              </div>
              
              {event.endDate && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Fim</p>
                    <p className="text-sm">{formatDate(event.endDate)}</p>
                  </div>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Local</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Link to={`/eventos/editar/${eventId}`}>
                <Button className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Evento
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={() => setShowVolunteerSelection(!showVolunteerSelection)}
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Gerenciar Voluntários
              </Button>
            </div>
          </div>

          {event.description && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Voluntários */}
      <Card>
        <CardHeader>
          <CardTitle>Voluntários Inscritos ({volunteersCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {volunteersCount === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum voluntário inscrito ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.volunteers.map((volunteer) => (
                <div
                  key={volunteer._id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Avatar>
                    <AvatarImage src={volunteer.profilePicture} />
                    <AvatarFallback>
                      {volunteer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{volunteer.name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeVolunteer({ eventId, volunteerId: volunteer._id })}
                    disabled={isRemoving}
                    className="text-red-600 hover:text-red-700"
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seleção de Voluntários */}
      {showVolunteerSelection && (
        <VolunteerSelection
          selectedVolunteers={event.volunteers.map(v => v._id)}
          onVolunteerToggle={(volunteerId: string) => {
            const isSelected = event.volunteers.some(v => v._id === volunteerId);
            if (isSelected) {
              removeVolunteer({ eventId, volunteerId });
            } else {
              if (canAddVolunteers) {
                addVolunteer({ eventId, volunteerId });
              }
            }
          }}
          maxVolunteers={maxVolunteers}
        />
      )}
    </div>
  );
}
