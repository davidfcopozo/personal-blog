import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useUpdateRequest = ({
  url,
  onSuccess,
  onError,
  onMutate,
  onSettled,
}: {
  url: string;
  onSuccess: () => void;
  onError: () => void;
  onMutate: (data: any) => Promise<unknown>;
  onSettled?: () => void;
}) => {
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

export default useUpdateRequest;
