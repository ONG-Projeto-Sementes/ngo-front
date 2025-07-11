import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import EditForm from './_components/EditForm';

export default function Editar() {
  const { id } = useParams<'id'>();
  if (!id) return null;

  return (
    <div className="p-4">
      <Header title="Editar Evento" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Eventos', to: ERoutes.Eventos },
          { label: 'Editar', to: `${ERoutes.EventosEditar}/${id}` },
        ]}
      />

      <EditForm eventId={id} />
    </div>
  );
}
