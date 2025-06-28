import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
  return (
    <div className="mt-4 flex justify-center items-center gap-2 w-full border rounded-lg border-gray-300 py-3 bg-white">
      <Button variant="outline" size="icon" onClick={() => setPage(Math.max(page - 1, 1))} disabled={page === 1}>
        ←
      </Button>
      {Array.from({ length: totalPages }).map((_, idx) => {
        const num = idx + 1;
        const isActive = num === page;
        if (num === 1 || num === totalPages || Math.abs(num - page) <= 1) {
          return (
            <Button key={num} variant={isActive ? 'default' : 'ghost'} size="icon" onClick={() => setPage(num)}>
              {num}
            </Button>
          );
        }
        if ((num === page - 2 && page > 3) || (num === page + 2 && page < totalPages - 2)) {
          return <span key={num}>…</span>;
        }
        return null;
      })}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPage(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
      >
        →
      </Button>
    </div>
  );
}
