import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import EventDetails from './_components/EventDetails';

export default function Detalhes() {
  const { id } = useParams<'id'>();
  if (!id) return null;

  return (
    <div className="p-4">
      <Header title="Detalhes do Evento" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Eventos', to: ERoutes.Eventos },
          { label: 'Detalhes', to: `${ERoutes.EventosDetalhes}/${id}` },
        ]}
      />

      <EventDetails eventId={id} />
    </div>
  );
}
