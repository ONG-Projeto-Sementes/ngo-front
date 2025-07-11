import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CategoryPerformance } from '@/services/analytics/getCategoryPerformance';

interface CategoryPerformanceCardProps {
  categories: CategoryPerformance[];
}

export function CategoryPerformanceCard({ categories }: CategoryPerformanceCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const sortedCategories = [...categories].sort((a, b) => b.totalValue - a.totalValue);
  const maxValue = sortedCategories[0]?.totalValue || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedCategories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma categoria com doações encontrada.
          </p>
        ) : (
          <div className="space-y-4">
            {sortedCategories.map((category) => (
              <div key={category._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: category.categoryColor || '#6b7280' }}
                    >
                      {category.categoryIcon || '📦'}
                    </div>
                    <span className="font-medium">{category.categoryName}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {formatCurrency(category.totalValue)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {category.totalDonations} doações
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(category.totalValue / maxValue) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex space-x-4">
                    <span>Qtd: {category.totalQuantity}</span>
                    <span>Doadores: {category.uniqueDonors}</span>
                    <span>Eficiência: {category.efficiency.toFixed(1)}%</span>
                  </div>
                  {category.lastDonation && (
                    <span>Última: {formatDate(category.lastDonation)}</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Recebidas: {category.receivedCount}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Distribuídas: {category.distributedCount}
                  </Badge>
                  {category.pendingCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Pendentes: {category.pendingCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
