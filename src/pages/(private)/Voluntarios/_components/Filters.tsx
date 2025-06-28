import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export default function Filters({ search, setSearch, setPage, isError, error, refetch }: FiltersProps) {
  return (
    <div className="mb-4 flex justify-between items-center gap-2 bg-white p-6 rounded-lg border border-gray-300">
      <div className="relative w-full max-w-xs">
        <Input
          type="search"
          placeholder="Buscar rápido..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10 w-full"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      {isError && (
        <div className="flex items-center gap-3 text-red-500">
          <p>Erro: {(error as Error).message}</p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      )}
    </div>
  );
}
