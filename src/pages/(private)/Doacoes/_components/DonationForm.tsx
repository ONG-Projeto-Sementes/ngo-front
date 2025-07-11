import React, { useState } from "react";
import { Trash2, Plus, Search, X } from "lucide-react";
import useSearchDonors from "../_hooks/useSearchDonors";
import { DonationItem, Donor } from "../../../../types/donations";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { Textarea } from "../../../../components/ui/textarea";

interface DonationFormProps {
  onSubmit: (data: {
    donors: Donor[];
    items: DonationItem[];
    additionalDetails?: string;
    images?: File[];
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DonationForm({ onSubmit, onCancel, loading }: DonationFormProps) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [items, setItems] = useState<DonationItem[]>([{ name: "", quantity: 1, description: "" }]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: searchResults, loading: searchLoading } = useSearchDonors(searchTerm);

  const handleAddDonor = (donor: Donor) => {
    setDonors([...donors, donor]);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const handleRemoveDonor = (index: number) => {
    setDonors(donors.filter((_, i) => i !== index));
  };

  const handleAddExternalDonor = () => {
    const name = prompt("Nome do doador:");
    const cpf = prompt("CPF do doador:");
    
    if (name && cpf) {
      handleAddDonor({
        type: "external",
        name,
        cpf,
      });
    }
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, description: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof DonationItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (donors.length === 0) {
      alert("Adicione pelo menos um doador");
      return;
    }

    if (items.some(item => !item.name || item.quantity <= 0)) {
      alert("Preencha todos os itens corretamente");
      return;
    }

    onSubmit({
      donors,
      items: items.filter(item => item.name), // Remove items vazios
      additionalDetails,
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seção de Doadores */}
      <Card>
        <CardHeader>
          <CardTitle>Doadores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Buscar Doadores */}
          <div className="relative">
            <Label htmlFor="search">Buscar Doadores (Voluntários/Beneficiários)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Digite o nome ou CPF..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                className="pl-10"
              />
            </div>
            
            {/* Resultados da Busca */}
            {showSearchResults && searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-3 text-center text-gray-500">Buscando...</div>
                ) : (
                  <>
                    {searchResults?.volunteers.map((volunteer) => (
                      <div
                        key={volunteer.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                        onClick={() => handleAddDonor({
                          type: "volunteer",
                          volunteerId: volunteer.id,
                        })}
                      >
                        <div className="font-medium">{volunteer.name}</div>
                        <div className="text-sm text-gray-500">
                          Voluntário - {volunteer.cpf}
                        </div>
                      </div>
                    ))}
                    {searchResults?.beneficiaries.map((beneficiary) => (
                      <div
                        key={beneficiary.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                        onClick={() => handleAddDonor({
                          type: "beneficiary",
                          beneficiaryId: beneficiary.id,
                        })}
                      >
                        <div className="font-medium">{beneficiary.name}</div>
                        <div className="text-sm text-gray-500">
                          Beneficiário - {beneficiary.cpf}
                        </div>
                      </div>
                    ))}
                    {searchResults?.volunteers.length === 0 && searchResults?.beneficiaries.length === 0 && (
                      <div className="p-3 text-center text-gray-500">
                        Nenhum resultado encontrado
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Botão para adicionar doador externo */}
          <Button type="button" variant="outline" onClick={handleAddExternalDonor}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Doador Externo
          </Button>

          {/* Lista de Doadores Adicionados */}
          <div className="space-y-2">
            {donors.map((donor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <Badge variant={donor.type === "volunteer" ? "default" : donor.type === "beneficiary" ? "secondary" : "outline"}>
                    {donor.type === "volunteer" ? "Voluntário" : donor.type === "beneficiary" ? "Beneficiário" : "Externo"}
                  </Badge>
                  <span className="font-medium">
                    {donor.name || `${donor.type === "volunteer" ? "Voluntário" : "Beneficiário"} ID: ${donor.volunteerId || donor.beneficiaryId}`}
                  </span>
                  {donor.cpf && <span className="text-sm text-gray-500">CPF: {donor.cpf}</span>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDonor(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seção de Itens */}
      <Card>
        <CardHeader>
          <CardTitle>Itens Doados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-md">
              <div>
                <Label>Nome do Item</Label>
                <Input
                  value={item.name}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  placeholder="Ex: Cesta básica"
                />
              </div>
              <div>
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  placeholder="Detalhes adicionais"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </CardContent>
      </Card>

      {/* Detalhes Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={additionalDetails}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdditionalDetails(e.target.value)}
            placeholder="Informações adicionais sobre a doação..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="images">Selecionar Imagens</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Doação"}
        </Button>
      </div>
    </form>
  );
}
