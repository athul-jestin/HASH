import { useMutation, UseQueryResult, UseMutationResult, useQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'

export const useApiQuery = <TData = unknown, TError = AxiosError>(
  queryKey: readonly (string | number | boolean | null | undefined)[],
  queryFn: () => Promise<AxiosResponse<TData>>,
  options?: Omit<UseQueryOptions<AxiosResponse<TData>, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<AxiosResponse<TData>, TError> => {
  return useQuery<AxiosResponse<TData>, TError>({
    queryKey,
    queryFn,
    ...options,
  } as any)
}

export const useApiMutation = <TData = unknown, TError = AxiosError, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<AxiosResponse<TData>>,
  options?: UseMutationOptions<AxiosResponse<TData>, TError, TVariables>
): UseMutationResult<AxiosResponse<TData>, TError, TVariables> => {
  return useMutation({
    mutationFn,
    ...options,
  })
}
