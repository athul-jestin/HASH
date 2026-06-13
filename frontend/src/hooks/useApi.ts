import { useMutation, UseQueryResult, UseMutationResult, useQuery } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'

export const useApiQuery = <TData = unknown, TError = AxiosError>(
  queryKey: readonly (string | number | boolean | null | undefined)[],
  queryFn: () => Promise<AxiosResponse<TData>>,
    options?: Parameters<typeof useQuery>[2]
): UseQueryResult<AxiosResponse<TData>, TError> => {
  return useQuery<AxiosResponse<TData>, TError>({
    queryKey,
    queryFn,
    ...options,
  })
}

export const useApiMutation = <TData = unknown, TError = AxiosError, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<AxiosResponse<TData>>,
    options?: Parameters<typeof useMutation>[1]
): UseMutationResult<AxiosResponse<TData>, TError, TVariables> => {
  return useMutation({
    mutationFn,
    ...options,
  })
}
