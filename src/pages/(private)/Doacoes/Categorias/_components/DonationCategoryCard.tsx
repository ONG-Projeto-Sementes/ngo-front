import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Eye, EyeOff } from 'lucide-react';
import type { DonationCategory } from '@/pages/(private)/Doacoes/_types/DonationCategory';

interface DonationCategoryCardProps {
  category: DonationCategory;
  onEdit: (category: DonationCategory) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export function DonationCategoryCard({ category, onEdit, onToggleActive }: DonationCategoryCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${!category.isActive ? 'opacity-70 border-dashed border-gray-300' : 'border-solid hover:border-gray-300'}`}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {category.icon && (
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0"
                style={{ backgroundColor: category.color || '#6b7280' }}
              >
                <span className="text-2xl">{category.icon}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-semibold text-gray-900 truncate">
                {category.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  📏 <span className="font-medium">{category.defaultUnit}</span>
                </span>
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge 
              variant={category.isActive ? 'default' : 'secondary'}
              className={`${
                category.isActive 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              } px-3 py-1`}
            >
              {category.isActive ? '✓ Ativo' : '⭕ Inativo'}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-2">
                <DropdownMenuItem 
                  onClick={() => onEdit(category)} 
                  className="cursor-pointer hover:bg-gray-50 p-3 rounded-md"
                >
                  <Edit className="h-4 w-4 mr-3 text-blue-600" />
                  <span>Editar categoria</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onToggleActive(category._id, !category.isActive)}
                  className="cursor-pointer hover:bg-gray-50 p-3 rounded-md"
                >
                  {category.isActive ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-3 text-orange-600" />
                      <span>Desativar categoria</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-3 text-green-600" />
                      <span>Ativar categoria</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="-mt-3 px-6">
        <p className="text-sm text-gray-700 leading-relaxed">
          {category.description}
        </p>
        
        {!category.isActive && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 flex items-center gap-2">
              <span>⚠️</span>
              <span>Esta categoria está inativa e não aparecerá em novas doações</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
