import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import EditBeneficiaryForm from './_components/EditBeneficiaryForm';

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

      <EditBeneficiaryForm familyId={familyId} beneficiaryId={beneficiaryId} />
    </div>
  );
}
