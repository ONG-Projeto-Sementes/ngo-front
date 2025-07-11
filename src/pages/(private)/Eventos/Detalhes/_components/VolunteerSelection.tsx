import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getVolunteers } from '@/services/volunteer/getVolunteers';
import type { VolunteerSelectionProps } from '../../_types';

export default function VolunteerSelection({ 
  selectedVolunteers, 
  onVolunteerToggle, 
  maxVolunteers 
}: VolunteerSelectionProps) {
  const [search, setSearch] = useState('');

  const { data: volunteersData, isLoading } = useQuery({
    queryKey: ['volunteers', { page: 1, limit: 100, search }],
    queryFn: () => getVolunteers({ page: 1, limit: 100, search }),
  });

  const volunteers = volunteersData?.data || [];
  const availableVolunteers = volunteers.filter(
    volunteer => !selectedVolunteers.includes(volunteer._id)
  );

  const canAddMore = !maxVolunteers || selectedVolunteers.length < maxVolunteers;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Voluntários ao Evento</CardTitle>
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar voluntários..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </CardHeader>
      
      <CardContent>
        {!canAddMore && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Número máximo de voluntários atingido ({maxVolunteers}).
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : availableVolunteers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {search ? 'Nenhum voluntário encontrado.' : 'Todos os voluntários já estão no evento.'}
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableVolunteers.map((volunteer) => (
              <div
                key={volunteer._id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Avatar>
                  <AvatarImage src={volunteer.profilePicture} />
                  <AvatarFallback>
                    {volunteer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="font-medium">{volunteer.name}</p>
                  {volunteer.contact && (
                    <p className="text-sm text-gray-600">{volunteer.contact}</p>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={() => onVolunteerToggle(volunteer._id)}
                  disabled={!canAddMore}
                  className="gap-1"
                >
                  <UserPlus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
