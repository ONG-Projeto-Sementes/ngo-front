import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import { useParams } from 'react-router-dom';
import EditForm from './_components/EditForm';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function EditFamilyPage() {
  const { id } = useParams<'id'>();
  if (!id) return null;

  return (
    <div className="p-4">
      <Header title="Editar Família" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Famílias', to: ERoutes.Familias },
          { label: 'Editar', to: `${ERoutes.FamiliasEditar}/${id}` },
        ]}
      />

      <EditForm familyId={id} />
    </div>
  );
}
