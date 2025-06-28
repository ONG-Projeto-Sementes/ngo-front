import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import BeneficiaryForm from './_components/BeneficiaryForm';
import BeneficiaryList from './_components/BeneficiaryList';

export default function FamilyBeneficiariesPage() {
  const { id } = useParams<'id'>();

  if (!id) return null;

  return (
    <div className="p-4">
      <Header title="Beneficiários da Família" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Famílias', to: ERoutes.Familias },
          { label: 'Beneficiários', to: `${ERoutes.Familias}/${id}/beneficiarios` },
        ]}
      />

      <div className="space-y-6 mt-4">
        {/* Formulário para adicionar beneficiário */}
        <BeneficiaryForm familyId={id} />

        {/* Lista de beneficiários existentes */}
        <BeneficiaryList familyId={id} />
      </div>
    </div>
  );
}
