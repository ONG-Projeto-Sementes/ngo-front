import { Calendar, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EventListItem } from '../_types';

interface EventCardProps {
  event: EventListItem;
  onDelete: (id: string) => void;
  isDeleting: boolean;
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

export default function EventCard({ event, onDelete, isDeleting }: EventCardProps) {
  const isEventPast = new Date(event.startDate) < new Date();
  const volunteersCount = event.volunteers.length;
  const maxVolunteers = event.maxVolunteers;

  return (
    <Card className="border-gray-300 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            {event.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{event.description}</p>
            )}
          </div>
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-16 h-16 object-cover rounded-lg ml-4"
            />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {isEventPast && <Badge variant="secondary">Finalizado</Badge>}
          <Badge variant="outline">
            <Users className="w-3 h-3 mr-1" />
            {volunteersCount}{maxVolunteers ? `/${maxVolunteers}` : ''} voluntários
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Início: {formatDate(event.startDate)}</span>
          </div>
          
          {event.endDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Fim: {formatDate(event.endDate)}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Link to={`/eventos/detalhes/${event._id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Ver Detalhes
            </Button>
          </Link>
          
          <Link to={`/eventos/editar/${event._id}`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(event._id)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
