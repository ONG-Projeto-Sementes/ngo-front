import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import type { SystemAlert } from '@/services/analytics/getSystemAlerts';

interface SystemAlertsCardProps {
  alerts: SystemAlert[];
}

const alertIcons = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  error: XCircle,
};

const alertColors = {
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
};

const severityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export function SystemAlertsCard({ alerts }: SystemAlertsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Alertas do Sistema</span>
          {alerts.length > 0 && (
            <Badge variant="secondary">
              {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhum alerta no momento</p>
            <p className="text-sm text-muted-foreground">
              Tudo funcionando normalmente!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAlerts.map((alert) => {
              const IconComponent = alertIcons[alert.type];
              
              return (
                <div 
                  key={`${alert.title}-${alert.createdAt}`} 
                  className={`p-4 border rounded-lg ${alertColors[alert.type]}`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={severityColors[alert.severity]} variant="secondary">
                            {alert.severity}
                          </Badge>
                          {alert.count && alert.count > 1 && (
                            <Badge variant="outline" className="text-xs">
                              {alert.count}x
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">
                        {alert.message}
                      </p>
                      {alert.category && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Categoria: {alert.category}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
