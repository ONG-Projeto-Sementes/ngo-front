import Header from '@/components/Header';
import { ERoutes } from '@/types/ERoutes';
import Breadcrumbs from '@/components/Breadcrumbs';
import RegisterForm from './_components/RegisterForm';

export default function Cadastrar() {
  return (
    <div className="p-4">
      <Header title="Cadastro de Voluntário" />
      <Breadcrumbs
        routes={[
          { label: 'Início', to: ERoutes.Inicio },
          { label: 'Voluntários', to: ERoutes.Voluntarios },
          { label: 'Cadastrar', to: ERoutes.VoluntariosCadastro },
        ]}
      />

      <RegisterForm />
    </div>
  );
}
