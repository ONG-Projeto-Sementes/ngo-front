import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { WidgetMetric } from '@/services/analytics/getWidgetMetrics';

interface MetricCardProps {
  metric: WidgetMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const formatValue = (value: number | string, format: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('pt-BR').format(value);
      default:
        return value.toString();
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {metric.title}
        </CardTitle>
        {metric.icon && (
          <div className="text-2xl">
            {metric.icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {formatValue(metric.value, metric.format)}
        </div>
        
        {metric.trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon(metric.trend.direction)}
            <span className={`text-xs ${getTrendColor(metric.trend.direction)}`}>
              {metric.trend.percentage}% {metric.trend.period}
            </span>
          </div>
        )}
        
        {metric.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {metric.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
