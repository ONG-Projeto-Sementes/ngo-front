import { useState } from 'react';
import { Plus } from 'lucide-react';
import Mobile from './_components/Mobile';
import Filters from './_components/Filters';
import Desktop from './_components/Desktop';
import Pagination from './_components/Pagination';
import Header from '../../../components/Header/index';
import useGetVolunteers from './_hooks/useGetVolunteers';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import useDeleteVolunteer from './_hooks/useDeleteVolunteer';
import { ERoutes } from '@/types/ERoutes';

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : 0;
}

export default function Voluntarios() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedValue(search, 300);

  const { mutate: remove, isPending: isDeleting } = useDeleteVolunteer(() => refetch());
  const { data: paginated, isLoading, isError, error, refetch } = useGetVolunteers(page, debouncedSearch);

  const volunteers = paginated?.data ?? [];
  const totalPages = paginated?.totalPages ?? 1;

  return (
    <div className="p-4">
      <Header
        title="Voluntários"
        actionLabel="Cadastrar"
        actionTo={ERoutes.VoluntariosCadastro}
        actionIcon={<Plus className="w-4 h-4" />}
      />

      {/* Filtro */}
      <Filters
        error={error}
        search={search}
        isError={isError}
        setPage={setPage}
        setSearch={setSearch}
        refetch={() => refetch()}
      />

      {/* MOBILE */}
      <Mobile
        remove={remove}
        isLoading={isLoading}
        volunteers={volunteers}
        isDeleting={isDeleting}
        calculateAge={calculateAge}
      />

      {/* DESKTOP */}
      <Desktop
        remove={remove}
        isLoading={isLoading}
        isDeleting={isDeleting}
        volunteers={volunteers}
        calculateAge={calculateAge}
      />

      {/* Paginação */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
