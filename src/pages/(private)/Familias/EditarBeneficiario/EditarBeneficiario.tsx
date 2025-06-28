import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function EditBeneficiaryPage() {
  const { familyId, beneficiaryId } = useParams<{ familyId: string; beneficiaryId: string }>();
  
  if (!familyId || !beneficiaryId) return null;

  return (
    <div className="p-4">
      <Header title="Editar Beneficiário" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Famílias', to: ERoutes.Familias },
          { label: 'Editar Família', to: `${ERoutes.FamiliasEditar}/${familyId}` },
          { label: 'Editar Beneficiário', to: `#` },
        ]}
      />

      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Página em Desenvolvimento</h3>
          <p className="text-gray-600 mb-4">
            Esta página será implementada para editar o beneficiário ID: <strong>{beneficiaryId}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Família ID: {familyId}
          </p>
        </div>
      </div>
    </div>
  );
}
