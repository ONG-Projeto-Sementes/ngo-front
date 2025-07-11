import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Package, CheckCircle, XCircle } from 'lucide-react';
import type { Donation } from '../../_types/Donation';
import type { DonationCategory } from '../../_types/DonationCategory';

interface DonationCardProps {
  donation: Donation;
  category?: DonationCategory;
  onEdit: (donation: Donation) => void;
  onStatusChange: (id: string, status: 'pending' | 'received' | 'distributed') => void;
}

const statusConfig = {
  pending: { bg: 'bg-yellow-100 text-yellow-800', label: 'Pendente', icon: Package },
  received: { bg: 'bg-blue-100 text-blue-800', label: 'Recebida', icon: CheckCircle },
  distributed: { bg: 'bg-green-100 text-green-800', label: 'Distribuída', icon: XCircle },
};

export function DonationCard({ donation, category, onEdit, onStatusChange }: DonationCardProps) {
  const status = statusConfig[donation.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{donation.donorName}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bg}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
              <div>
                <span className="font-medium">Categoria:</span> 
                <span className="ml-1">
                  {category?.icon} {category?.name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium">Quantidade:</span> 
                <span className="ml-1">{donation.quantity} {donation.unit}</span>
              </div>
              <div>
                <span className="font-medium">Valor estimado:</span> 
                <span className="ml-1">{formatCurrency(donation.estimatedValue)}</span>
              </div>
              <div>
                <span className="font-medium">Data:</span> 
                <span className="ml-1">{formatDate(donation.receivedDate)}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {donation.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                <span className="font-medium">Contato:</span> {donation.donorContact}
              </span>
              {donation.notes && (
                <span>
                  <span className="font-medium">Observações:</span> {donation.notes}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(donation)}
            >
              Editar
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(donation)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                {donation.status === 'pending' && (
                  <DropdownMenuItem onClick={() => onStatusChange(donation._id, 'received')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Recebida
                  </DropdownMenuItem>
                )}
                {donation.status === 'received' && (
                  <DropdownMenuItem onClick={() => onStatusChange(donation._id, 'distributed')}>
                    <Package className="h-4 w-4 mr-2" />
                    Marcar como Distribuída
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
