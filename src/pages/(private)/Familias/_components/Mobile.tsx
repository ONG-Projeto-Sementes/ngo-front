import { Link } from 'react-router-dom';
import { Eye, Trash } from 'lucide-react';
import { ERoutes } from '@/types/ERoutes';
import type { FamilyDTO } from '@/services/families/getFamilies';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface MobileProps {
  families: FamilyDTO[];
  isLoading: boolean;
  isDeleting: boolean;
  remove: (id: string) => void;
}

export default function Mobile({ families, isLoading, isDeleting, remove }: MobileProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 sm:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:hidden">
      {families.map((fam) => (
        <Card key={fam._id} className="border-gray-300">
          <CardHeader>
            <h5 className="font-medium">{fam.name}</h5>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Cidade:</strong> {fam.city}
            </p>
            <p>
              <strong>Bairro:</strong> {fam.neighborhood}
            </p>
            {fam.address && (
              <p>
                <strong>Endereço:</strong> {fam.address}
              </p>
            )}
            {fam.contact && (
              <p>
                <strong>Contato:</strong> {fam.contact}
              </p>
            )}
            <p>
              <strong>Criado em:</strong> {new Date(fam.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <div className="flex gap-2 pt-2">
              <Link 
                to={`${ERoutes.FamiliasEditar}/${fam._id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <button 
                onClick={() => remove(fam._id)} 
                disabled={isDeleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
      {families.length === 0 && <p className="text-center text-gray-500">Nenhuma família encontrada.</p>}
    </div>
  );
}
