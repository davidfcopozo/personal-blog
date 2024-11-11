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
    mutationFn: async (body: any) => {
      const res = await axios.post(url, body);
      return res.data.data;
    },
    onSuccess: onSuccess,
    onError: onError,
    onMutate: onMutate,
  });

  return { mutate, data, status, error };
}
export default usePostRequest;
