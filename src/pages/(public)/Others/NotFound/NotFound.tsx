import { Loader2 } from 'lucide-react';

export default function NotFound() {
	return (
		<div className="flex items-center justify-center h-screen">
			<Loader2 className="size-4 animate-spin" />
		</div>
	);
}
