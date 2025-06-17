import { useLocation } from 'react-router-dom';

export default function usePathName() {
	const { pathname } = useLocation();
	return pathname;
}
