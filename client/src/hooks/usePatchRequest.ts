import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// Generic interface for the context that will be passed between callbacks
interface MutationContext<TData> {
  previousData?: TData;
  newData?: TData;
  // Add other context properties as needed
}

// Props interface for the hook
interface UsePatchRequestProps<TData, TVariables> {
  url: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (
    error: AxiosError,
    variables: TVariables,
    context: MutationContext<TData> | undefined
  ) => void;
  onMutate?: (variables: TVariables) => Promise<MutationContext<TData>>;
  onSettled?: (
    data: TData | undefined,
    error: AxiosError | null,
    variables: TVariables,
    context: MutationContext<TData> | undefined
  ) => void;
}

const usePatchRequest = <TData = unknown, TVariables = unknown>({
  url,
  onSuccess,
  onError,
  onMutate,
  onSettled,
}: UsePatchRequestProps<TData, TVariables>) => {
  const { mutate, data, status, error } = useMutation({
    mutationFn: async (body: any) => {
      const res = await axios.patch(url, body);
      return res.data.data;
    },
    onSuccess: onSuccess,
    onError: onError,
    onMutate: onMutate,
    onSettled: onSettled,
  });
  return { mutate, data, status, error };
};

export default usePatchRequest;
