import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import type { DonationCategory, DonationCategoryPayload } from '@/pages/(private)/Doacoes/_types/DonationCategory';
import { Loader2, Package, Palette } from 'lucide-react';

interface SimpleDonationCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: DonationCategory;
  onSubmit: (data: DonationCategoryPayload) => void;
  isLoading?: boolean;
}

export function SimpleDonationCategoryFormDialog({ 
  open, 
  onOpenChange, 
  category, 
  onSubmit, 
  isLoading = false 
}: SimpleDonationCategoryFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultUnit: '',
    icon: '📦',
    color: '#6b7280',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Atualizar formData quando category mudar
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        defaultUnit: category.defaultUnit || '',
        icon: category.icon || '📦',
        color: category.color || '#6b7280',
        isActive: category.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        defaultUnit: '',
        icon: '📦',
        color: '#6b7280',
        isActive: true,
      });
    }
    setErrors({});
  }, [category, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.defaultUnit.trim()) {
      newErrors.defaultUnit = 'Unidade padrão é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro específico quando o usuário corrigir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const commonUnits = ['unidade', 'kg', 'litro', 'caixa', 'pacote', 'saco'];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto p-0">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              {category ? 'Editar Categoria' : 'Nova Categoria'}
            </SheetTitle>
            <p className="text-sm text-gray-600 mt-2">
              {category 
                ? 'Atualize as informações da categoria' 
                : 'Preencha os dados para criar uma nova categoria de doações'
              }
            </p>
          </SheetHeader>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Nome da Categoria *
              </Label>
              <Input
                id="name"
                placeholder="Ex: Alimentos, Roupas, Brinquedos"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`h-11 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.name}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Descrição *
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva o tipo de doação desta categoria..."
                className={`resize-none min-h-[80px] ${errors.description ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.description}
                </p>
              )}
            </div>

            {/* Unidade Padrão */}
            <div className="space-y-3">
              <Label htmlFor="defaultUnit" className="text-sm font-semibold text-gray-700">
                Unidade Padrão *
              </Label>
              <Input
                id="defaultUnit"
                placeholder="Ex: kg, unidade, litro"
                value={formData.defaultUnit}
                onChange={(e) => handleChange('defaultUnit', e.target.value)}
                className={`h-11 ${errors.defaultUnit ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {errors.defaultUnit && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.defaultUnit}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <p className="text-xs text-gray-500 w-full mb-1">Sugestões:</p>
                {commonUnits.map((unit) => (
                  <Badge
                    key={unit}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors px-3 py-1"
                    onClick={() => handleChange('defaultUnit', unit)}
                  >
                    {unit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ícone e Cor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="icon" className="text-sm font-semibold text-gray-700">
                  Ícone
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="icon"
                    placeholder="📦"
                    value={formData.icon}
                    onChange={(e) => handleChange('icon', e.target.value)}
                    className="flex-1 h-11 focus:border-blue-500"
                  />
                  <div 
                    className="w-11 h-11 rounded-lg border-2 border-gray-200 flex items-center justify-center text-xl shadow-sm"
                    style={{ backgroundColor: formData.color, color: 'white' }}
                  >
                    {formData.icon}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="color" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Cor
                </Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="h-11 w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Status da Categoria
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Categorias ativas aparecem para seleção em novas doações
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {category ? 'Atualizar' : 'Criar'} Categoria
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
