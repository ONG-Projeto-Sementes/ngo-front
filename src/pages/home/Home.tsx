import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';

export default function HomePage() {
	const { logout } = useAuth();

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h4>Botão teste de sair</h4>
			<Button onClick={() => logout()}>Sair</Button>
		</div>
	);
}
