import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDonationCategories } from './_hooks/useDonationCategories';
import { useCreateDonationCategory } from './_hooks/useCreateDonationCategory';
import { useUpdateDonationCategory } from './_hooks/useUpdateDonationCategory';
import { useToggleDonationCategoryActivation } from './_hooks/useToggleDonationCategoryActivation';
import { DonationCategoryCard } from './_components/DonationCategoryCard';
import { SimpleDonationCategoryFormDialog } from './_components/SimpleDonationCategoryFormDialog';
import type { DonationCategory, DonationCategoryPayload } from '../_types/DonationCategory';
import { toast } from 'sonner';

export default function CategoriasDoacoes() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DonationCategory | undefined>();

  const { data: categoriesResponse, isLoading } = useDonationCategories({
    page: 1,
    limit: 100,
    search: search || undefined,
  });

  const categories = categoriesResponse?.data?.data || [];

  const createMutation = useCreateDonationCategory();
  const updateMutation = useUpdateDonationCategory();
  const toggleActivationMutation = useToggleDonationCategoryActivation();

  const handleCreate = () => {
    setEditingCategory(undefined);
    setFormOpen(true);
  };

  const handleEdit = (category: DonationCategory) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleSubmit = (data: DonationCategoryPayload) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory._id, data },
        {
          onSuccess: () => {
            toast.success('Categoria atualizada com sucesso!');
            setFormOpen(false);
            setEditingCategory(undefined);
          },
          onError: () => {
            toast.error('Erro ao atualizar categoria');
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Categoria criada com sucesso!');
          setFormOpen(false);
        },
        onError: () => {
          toast.error('Erro ao criar categoria');
        },
      });
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleActivationMutation.mutate(
      { id, isActive },
      {
        onSuccess: () => {
          toast.success(
            `Categoria ${isActive ? 'ativada' : 'desativada'} com sucesso!`
          );
        },
        onError: () => {
          toast.error('Erro ao alterar status da categoria');
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias de Doações</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias disponíveis para classificar doações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {categories.length} categoria{categories.length !== 1 ? 's' : ''} 
            {categories.filter(c => c.isActive).length !== categories.length && 
              ` • ${categories.filter(c => c.isActive).length} ativa${categories.filter(c => c.isActive).length !== 1 ? 's' : ''}`
            }
          </div>
        </div>
      </div>

      {/* Barra de busca e ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar categorias por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: DonationCategory) => (
            <DonationCategoryCard
              key={category._id}
              category={category}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {search ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria criada ainda'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {search 
                ? `Não foi possível encontrar categorias com "${search}". Tente uma busca diferente.`
                : 'Comece criando categorias para organizar e classificar suas doações de forma eficiente.'
              }
            </p>
            {!search && (
              <Button onClick={handleCreate} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Categoria
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Formulário */}
      <SimpleDonationCategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
