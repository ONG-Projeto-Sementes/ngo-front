import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import Breadcrumbs from '@/components/Breadcrumbs';
import RegisterForm from './_components/RegisterForm';

export default function CreateFamilyPage() {
  return (
    <div className="p-4">
      <Header title="Cadastro de Família" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Famílias', to: ERoutes.Familias },
          { label: 'Cadastrar', to: ERoutes.FamiliasCriar },
        ]}
      />

      <RegisterForm />
    </div>
  );
}
