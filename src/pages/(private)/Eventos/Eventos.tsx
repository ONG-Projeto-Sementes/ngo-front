import { useState } from 'react';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import useGetEvents from './_hooks/useGetEvents';
import useDeleteEvent from './_hooks/useDeleteEvent';
import EventsHeader from './_components/EventsHeader';
import Filters from './_components/Filters';
import EventCard from './_components/EventCard';
import EventCardSkeleton from './_components/EventCardSkeleton';
import Pagination from './_components/Pagination';

export default function Eventos() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedValue(search, 300);

  const { mutate: remove, isPending: isDeleting } = useDeleteEvent(() => refetch());
  const { data: paginated, isLoading, isError, error, refetch } = useGetEvents(page, debouncedSearch);

  const events = paginated?.data ?? [];
  const totalPages = paginated?.totalPages ?? 1;

  return (
    <div className="p-4 space-y-4">
      <EventsHeader />
      
      <Filters
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        isError={isError}
        error={error}
        refetch={refetch}
      />

      {/* Grid de eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
          : events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={remove}
                isDeleting={isDeleting}
              />
            ))}
      </div>

      {!isLoading && events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum evento encontrado.</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </div>
  );
}
