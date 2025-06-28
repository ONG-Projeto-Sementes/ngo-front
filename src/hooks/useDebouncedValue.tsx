import { useEffect, useRef, useState } from 'react';

function useDebouncedValue<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const timer = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebouncedValue;
