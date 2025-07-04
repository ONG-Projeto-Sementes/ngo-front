import { useQuery as reactUseQuery, type QueryKey } from '@tanstack/react-query';

type UseQueryParams<R, F = unknown> = {
	queryKey: QueryKey;
	service: (filters?: F) => Promise<R>;
	autoStart?: boolean;
	queryHash?: string;
	refetchInterval?: number;
};

function useQuery<R, F = unknown>({
	queryKey,
	service,
	autoStart = true,
	queryHash,
	refetchInterval = 0,
}: UseQueryParams<R, F>) {
	const { isLoading, data, refetch, isSuccess, isError, error } = reactUseQuery<R, Error>({
		queryKey,
		queryHash,
		queryFn: () => {
			const [, filters] = queryKey as [string, F];
			return service(filters);
		},
		enabled: autoStart,
		gcTime: 0,
		refetchInterval,
	});

	return { isLoading, data, isSuccess, isError, error, refetch };
}

export default useQuery;
