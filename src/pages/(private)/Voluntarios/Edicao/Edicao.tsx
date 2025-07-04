import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import { useParams } from 'react-router-dom';
import EditForm from './_components/EditForm';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Edicao() {
  const { id } = useParams<'id'>();
  if (!id) return null;

  return (
    <div className="p-4">
      <Header title="Editar Voluntário" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Voluntários', to: ERoutes.Voluntarios },
          { label: 'Editar', to: `${ERoutes.VoluntariosEdicao}/${id}` },
        ]}
      />

      <EditForm volunteerId={id} />
    </div>
  );
}
