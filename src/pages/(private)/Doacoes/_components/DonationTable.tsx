import { useState } from 'react';
import { Eye, Trash2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { DonationDTO } from '@/types/donations';

interface DonationTableProps {
  donations: DonationDTO[];
  loading: boolean;
  onView: (donation: DonationDTO) => void;
  onDelete: (id: string) => void;
  onNewDonation: () => void;
}

export default function DonationTable({ donations, loading, onView, onDelete, onNewDonation }: DonationTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donors.some(
        (donor) => donor.name?.toLowerCase().includes(search.toLowerCase()) || donor.cpf?.includes(search)
      ) ||
      donation.items.some((item) => item.name.toLowerCase().includes(search.toLowerCase())) ||
      donation.additionalDetails?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDonorNames = (donors: DonationDTO['donors']) => {
    return donors
      .map(
        (donor) =>
          donor.name || `${donor.type === 'volunteer' ? 'Vol.' : 'Ben.'} ${donor.volunteerId || donor.beneficiaryId}`
      )
      .join(', ');
  };

  const getItemsSummary = (items: DonationDTO['items']) => {
    return items.map((item) => `${item.quantity}x ${item.name}`).join(', ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando doações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com busca e botão de nova doação */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por doador, item ou detalhes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={onNewDonation}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Doação
        </Button>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Doações Cadastradas ({filteredDonations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {donations.length === 0
                  ? 'Nenhuma doação cadastrada ainda.'
                  : 'Nenhuma doação encontrada com os filtros aplicados.'}
              </p>
              {donations.length === 0 && (
                <Button onClick={onNewDonation} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar primeira doação
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Doadores</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead>Imagens</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDonations.map((donation) => (
                    <TableRow key={donation._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatDate(donation.donationDate)}</div>
                          <div className="text-sm text-gray-500">Cadastrado: {formatDate(donation.createdAt)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{getDonorNames(donation.donors)}</div>
                          <div className="flex flex-wrap gap-1">
                            {donation.donors.map((donor, index) => (
                              <Badge
                                key={index}
                                variant={
                                  donor.type === 'volunteer'
                                    ? 'default'
                                    : donor.type === 'beneficiary'
                                      ? 'secondary'
                                      : 'outline'
                                }
                                className="text-xs"
                              >
                                {donor.type === 'volunteer'
                                  ? 'Voluntário'
                                  : donor.type === 'beneficiary'
                                    ? 'Beneficiário'
                                    : 'Externo'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium">{donation.items.length} item(s)</div>
                          <div className="text-sm text-gray-600 truncate">{getItemsSummary(donation.items)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {donation.additionalDetails ? (
                            <div className="text-sm text-gray-600 truncate">{donation.additionalDetails}</div>
                          ) : (
                            <span className="text-gray-400 text-sm">Sem detalhes</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{donation.images?.length || 0} imagem(s)</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => onView(donation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onDelete(donation._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
