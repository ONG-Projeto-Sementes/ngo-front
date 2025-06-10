import { useMutation as reactuseMutation, type UseMutationResult } from '@tanstack/react-query';

function useMutation<R, D>({
	service,
	onSuccess,
	onError,
}: {
	service: (data: R) => Promise<D>;
	onSuccess?: () => void;
	onError?: (error?: { message: string; name: string }) => void;
}): [UseMutationResult<D, unknown, R, unknown>] {
	const mutation = reactuseMutation({
		mutationFn: service,
		onSuccess,
		onError,
	});

	return [mutation];
}

export default useMutation;
