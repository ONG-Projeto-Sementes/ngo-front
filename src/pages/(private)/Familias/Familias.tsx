import { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import Mobile from './_components/Mobile';
import Desktop from './_components/Desktop';
import Filters from './_components/Filters';
import Pagination from './_components/Pagination';
import useGetFamilies from './_hooks/useGetFamilies';
import useDeleteFamily from './_hooks/useDeleteFamily';
import useDebouncedValue from '@/hooks/useDebouncedValue';

export default function FamiliesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: families = [], isLoading, isError, error, refetch } = useGetFamilies(page, debouncedSearch);
  const { mutate: remove, isPending: isDeleting } = useDeleteFamily(() => refetch());

  const totalPages = Math.ceil(families.length / 10);

  return (
    <div className="p-4">
      <Header
        title="Famílias"
        actionLabel="Nova Família"
        actionTo={ERoutes.FamiliasCriar}
        actionIcon={<Plus className="w-4 h-4" />}
      />

      <Filters
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        isError={isError}
        error={error}
        refetch={refetch}
      />

      <Mobile families={families} isLoading={isLoading} isDeleting={isDeleting} remove={remove} />

      <Desktop families={families} isLoading={isLoading} isDeleting={isDeleting} remove={remove} />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
