import { Link } from 'react-router-dom';
import { Eye, Trash } from 'lucide-react';
import { ERoutes } from '@/types/ERoutes';
import type { FamilyDTO } from '@/services/families/getFamilies';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DesktopProps {
  families: FamilyDTO[];
  isLoading: boolean;
  isDeleting: boolean;
  remove: (id: string) => void;
}

export default function Desktop({ families, isLoading, isDeleting, remove }: DesktopProps) {
  return (
    <div className="hidden sm:block border rounded-lg border-gray-300">
      <Table className="pt-1">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">Nome</TableHead>
            <TableHead className="px-4">Cidade</TableHead>
            <TableHead className="px-4">Bairro</TableHead>
            <TableHead className="px-4">Endereço</TableHead>
            <TableHead className="px-4">Contato</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array(6)
                    .fill(0)
                    .map((_, idx) => (
                      <TableCell key={idx} className="px-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            : families.map((fam) => (
                <TableRow key={fam._id}>
                  <TableCell className="px-4">{fam.name}</TableCell>
                  <TableCell className="px-4">{fam.city}</TableCell>
                  <TableCell className="px-4">{fam.neighborhood}</TableCell>
                  <TableCell className="px-4">{fam.address}</TableCell>
                  <TableCell className="px-4">{fam.contact}</TableCell>
                  <TableCell className="px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`${ERoutes.FamiliasEditar}/${fam._id}`}>
                        <Eye className="w-5 h-5 text-primary hover:text-primary-dark" />
                      </Link>
                      <button onClick={() => remove(fam._id)} disabled={isDeleting}>
                        <Trash className="w-5 h-5 text-red-600 hover:text-red-800" />
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
