import { UseMutationRequestProps } from "@/typings/interfaces";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const usePatchRequest = <TData = unknown, TVariables = unknown>({
  url,
  onSuccess,
  onError,
  onMutate,
  onSettled,
}: UseMutationRequestProps<TData, TVariables>) => {
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
