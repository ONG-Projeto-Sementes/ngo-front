import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Package, Users } from 'lucide-react';
import { CategoryDisplay } from './CategoryDisplay';
import type { Donation } from '../../_types/Donation';
import type { DonationCategory } from '../../_types/DonationCategory';

interface DonationCardProps {
  donation: Donation;
  onEdit: (donation: Donation) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'received' | 'distributed') => void;
  onManageDistributions: (donation: Donation) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  received: 'bg-blue-100 text-blue-800 border-blue-200',
  distributed: 'bg-green-100 text-green-800 border-green-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels = {
  pending: 'Pendente',
  received: 'Recebida',
  distributed: 'Distribuída',
  expired: 'Expirada',
};

const statusLabelsShort = {
  pending: 'Pend.',
  received: 'Receb.',
  distributed: 'Distr.',
  expired: 'Exp.',
};

export function DonationCard({
  donation,
  onEdit,
  onDelete,
  onStatusChange,
  onManageDistributions,
}: DonationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStatusChange = async (status: 'pending' | 'received' | 'distributed') => {
    setIsLoading(true);
    try {
      await onStatusChange(donation._id, status);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir a doação de "${donation.donorName}"?`)) {
      onDelete(donation._id);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 h-full min-w-0">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          {/* Primeira linha: Info principal */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base sm:text-lg truncate">{donation.donorName}</h3>
              <div className="mt-1">
                <CategoryDisplay 
                  category={donation.category as DonationCategory} 
                  categoryId={typeof donation.categoryId === 'string' ? donation.categoryId : donation.categoryId?._id}
                />
              </div>
            </div>
          </div>
          
          {/* Segunda linha: Status e Menu sempre lado a lado */}
          <div className="flex items-center justify-between gap-2">
            <Badge className={`${statusColors[donation.status]} text-xs flex-shrink-0 min-w-0`}>
              <span className="hidden sm:inline truncate">{statusLabels[donation.status]}</span>
              <span className="sm:hidden truncate">{statusLabelsShort[donation.status]}</span>
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isLoading} className="h-8 w-8 p-0 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(donation)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                
                {donation.status !== 'received' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('received')}>
                    <Package className="h-4 w-4 mr-2" />
                    Marcar como Recebida
                  </DropdownMenuItem>
                )}
                
                {donation.status === 'received' && (
                  <DropdownMenuItem onClick={() => onManageDistributions(donation)}>
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Distribuições
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Quantidade</p>
            <p className="text-sm sm:text-lg font-semibold">
              {donation.quantity} {donation.unit}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Valor</p>
            <p className="text-sm sm:text-lg font-semibold text-green-600">
              {donation.estimatedValue ? formatCurrency(donation.estimatedValue) : 'Valor não informado'}
            </p>
          </div>
        </div>

        {donation.status === 'received' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Distribuído</p>
              <p className="text-xs sm:text-sm font-semibold">
                {donation.quantityDistributed || 0} {donation.unit}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Disponível</p>
              <p className="text-xs sm:text-sm font-semibold text-blue-600">
                {donation.quantityRemaining || donation.quantity} {donation.unit}
              </p>
            </div>
          </div>
        )}

        {donation.donorContact && (
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Contato</p>
            <p className="text-xs sm:text-sm break-all">{donation.donorContact}</p>
          </div>
        )}

        {donation.description && (
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Descrição</p>
            <p className="text-xs sm:text-sm line-clamp-2">{donation.description}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between text-xs text-muted-foreground pt-2 border-t gap-1">
          <span>Criada em {formatDate(donation.createdAt)}</span>
          {donation.receivedDate && (
            <span>Recebida em {formatDate(donation.receivedDate)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
