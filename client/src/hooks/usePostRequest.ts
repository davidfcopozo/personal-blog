import { usePostRequestType } from "@/typings/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const baseULR = process.env.NEXT_PUBLIC_FRONTEND_API_ENDPOINT;

function usePostRequest({
  url,
  onSuccess,
  onError,
  onMutate,
}: usePostRequestType) {
  const mutateFunction = async (body: any) => {
    const response = await axios.post(`${baseULR}/${url}`, body);
    return response.data;
  };

  const { mutate, data, status, error } = useMutation({
    mutationFn: mutateFunction,
    onSuccess: onSuccess,
    onError: onError,
    onMutate: onMutate,
  });

  return { mutate, data, status, error };
}

export default usePostRequest;
