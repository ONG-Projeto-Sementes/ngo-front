import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-lg border border-gray-300">
      <h4 className="text-lg font-semibold">Voluntários</h4>
      <Link
        to="/voluntarios/cadastro"
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
      >
        <Plus className="w-4 h-4" /> Cadastrar
      </Link>
    </div>
  );
}
