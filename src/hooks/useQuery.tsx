import {
    type RefetchOptions,
    useQuery as reactUseQuery,
    type RefetchQueryFilters,
} from "@tanstack/react-query";

function useQuery<R, F>({
  queryKey,
  service,
  autoStart = true,
  queryHash,
}: {
  queryKey?: [keyof F, F[keyof F] | undefined];
  service: (filters?: F[keyof F]) => Promise<R>;
  autoStart?: boolean;
  queryHash?: string;
}): {
  isLoading: boolean;
  data: R | undefined;
  isSuccess: boolean;
  isError: boolean;
  error: any;
  refetch: (data?: RefetchOptions & RefetchQueryFilters<[keyof F, F[keyof F] | undefined]>) => void;
} {
  const { isLoading, data, refetch, isSuccess, isError, error } = reactUseQuery(
    {
      queryHash,
      queryKey: [queryKey],
      queryFn: () => service(queryKey?.[1]),
      enabled: autoStart,
    },
  );

  return { isLoading, data, isSuccess, isError, error, refetch };
}

export default useQuery;