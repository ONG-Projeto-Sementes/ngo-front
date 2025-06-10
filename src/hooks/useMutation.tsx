import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation as QueryMutationService } from '@tanstack/react-query';

export type DefaultUseMutation<TParams, TData> = {
	isPending: boolean;
	error: Error | null;
	data: TData | undefined;
	mutate: (data: TParams) => void;
	mutateAsync: (data: TParams) => Promise<TData>;
};

export default function useMutation<TParams, TData = undefined>(
	service: (data: TParams) => Promise<TData>,
	options?: UseMutationOptions<TData, Error, TParams>,
): DefaultUseMutation<TParams, TData> {
	const mutation = QueryMutationService<TData, Error, TParams>({
		mutationFn: service,
		onMutate: async (variables) => {
			if (options?.onMutate) {
				return options.onMutate(variables);
			}
		},
		onSuccess: (data, variables, context) => {
			if (options?.onSuccess) {
				options.onSuccess(data, variables, context);
			}
		},
		...options,
	});

	return {
		mutate: mutation.mutate,
		data: mutation.data,
		error: mutation.error,
		isPending: mutation.isPending,
		mutateAsync: mutation.mutateAsync,
	};
}
