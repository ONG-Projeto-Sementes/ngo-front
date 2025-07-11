import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import Breadcrumbs from '@/components/Breadcrumbs';
import CreateForm from './_components/CreateForm';

export default function Criar() {
  return (
    <div className="p-4">
      <Header title="Criar Evento" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Eventos', to: ERoutes.Eventos },
          { label: 'Criar', to: ERoutes.EventosCriar },
        ]}
      />

      <CreateForm />
    </div>
  );
}
