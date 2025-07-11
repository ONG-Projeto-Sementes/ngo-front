import { User, Calendar, Users, Phone, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import useGetBeneficiaries from '../_hooks/useGetBeneficiaries';
import useDeleteBeneficiary from '../_hooks/useDeleteBeneficiary';

interface Props {
  familyId: string;
}

export default function BeneficiaryList({ familyId }: Props) {
  const { data: beneficiaries, isLoading, isError, error } = useGetBeneficiaries(familyId);
  const { mutate: deleteBeneficiary, isPending: isDeleting } = useDeleteBeneficiary(familyId);

  const handleDelete = (beneficiaryId: string, beneficiaryName: string) => {
    if (confirm(`Tem certeza que deseja excluir o beneficiário "${beneficiaryName}"?`)) {
      deleteBeneficiary(beneficiaryId);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Beneficiários da Família</h3>
        <p className="text-gray-500">Carregando beneficiários...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Beneficiários da Família</h3>
        <p className="text-red-600">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Beneficiários da Família ({beneficiaries?.length || 0})
      </h3>

      {!beneficiaries || beneficiaries.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Nenhum beneficiário cadastrado ainda.</p>
          <p className="text-sm text-gray-400 mt-1">
            Use o formulário acima para adicionar o primeiro beneficiário.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {beneficiary.name}
                </h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  {new Date(beneficiary.birthDate).toLocaleDateString('pt-BR')}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3 w-3" />
                  {beneficiary.cpf}
                </div>

                <div className="flex gap-2 pt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {beneficiary.degreeOfKinship}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {beneficiary.genre === 'M' ? 'Masculino' : beneficiary.genre === 'F' ? 'Feminino' : 'Outro'}
                  </span>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-3 border-t border-gray-200 mt-3">
                  <Link
                    to={`/familias/${familyId}/beneficiarios/${beneficiary._id}/editar`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(beneficiary._id, beneficiary.name)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
