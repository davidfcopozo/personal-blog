import { UseMutationRequestProps } from "@/typings/interfaces";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const usePutRequest = <TData = unknown, TVariables = unknown>({
  url,
  onSuccess,
  onError,
  onMutate,
  onSettled,
}: UseMutationRequestProps<TData, TVariables>) => {
  const { mutate, data, status, error } = useMutation({
    mutationFn: async (body: any) => {
      const res = await axios.put(url, body);
      return res.data;
    },
    onSuccess: onSuccess,
    onError: onError,
    onMutate: onMutate,
    onSettled: onSettled,
  });
  return { mutate, data, status, error };
};

export default usePutRequest;
