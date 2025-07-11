import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ERoutes } from '@/types/ERoutes';
import { toast } from 'sonner';

// Mock categories
const mockCategories = [
  { id: '1', name: 'Alimentos', defaultUnit: 'kg' },
  { id: '2', name: 'Roupas', defaultUnit: 'peças' },
  { id: '3', name: 'Brinquedos', defaultUnit: 'unidades' },
  { id: '4', name: 'Material Escolar', defaultUnit: 'unidades' },
  { id: '5', name: 'Higiene', defaultUnit: 'unidades' },
  { id: '6', name: 'Medicamentos', defaultUnit: 'caixas' },
];

export default function CriarDoacao() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    donorName: '',
    donorContact: '',
    categoryId: '',
    quantity: '',
    unit: '',
    description: '',
    estimatedValue: '',
    receivedDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: '',
  });

  const handleCategoryChange = (categoryId: string) => {
    const category = mockCategories.find(cat => cat.id === categoryId);
    setFormData(prev => ({
      ...prev,
      categoryId,
      unit: category?.defaultUnit || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.donorName || !formData.categoryId || !formData.quantity) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    // Simular criação
    toast.success('Doação criada com sucesso!');
    navigate(ERoutes.DoacoesLista);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(ERoutes.DoacoesLista)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Doação</h1>
          <p className="text-muted-foreground">
            Registre uma nova doação recebida pela organização
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Doador</CardTitle>
            <CardDescription>
              Dados da pessoa ou organização que está fazendo a doação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Nome do Doador *</Label>
                <Input
                  id="donorName"
                  placeholder="Nome completo ou razão social"
                  value={formData.donorName}
                  onChange={(e) => handleInputChange('donorName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorContact">Contato</Label>
                <Input
                  id="donorContact"
                  placeholder="Telefone ou e-mail"
                  value={formData.donorContact}
                  onChange={(e) => handleInputChange('donorContact', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Doação</CardTitle>
            <CardDescription>
              Informações sobre o que está sendo doado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoria *</Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivedDate">Data de Recebimento</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) => handleInputChange('receivedDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Input
                  id="unit"
                  placeholder="kg, peças, unidades..."
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Valor Estimado (R$)</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva os itens doados..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações adicionais..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(ERoutes.DoacoesLista)}
          >
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Salvar Doação
          </Button>
        </div>
      </form>
    </div>
  );
}
