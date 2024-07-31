import { InitialPost } from "@/typings/interfaces";
import { UsePostRequestType } from "@/typings/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function usePostRequest({
  url,
  onSuccess,
  onError,
  onMutate,
}: UsePostRequestType) {
  const { mutate, data, status, error } = useMutation({
    mutationFn: async (body: InitialPost) => {
      const res = await axios.post(url, body);
      return res.data;
    },
    onSuccess: onSuccess,
    onError: onError,
    onMutate: onMutate,
  });

  return { mutate, data, status, error };
}
export default usePostRequest;
