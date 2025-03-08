import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { UseMutationRequestProps } from "@/typings/interfaces";

interface DeleteImageProps {
  itemId: string;
  key?: string;
}

const useDeleteImages = ({
  url,
  onSuccess,
  onError,
  onMutate,
}: UseMutationRequestProps<any, any>) => {
  const deleteImage = async ({ itemId }: DeleteImageProps) => {
    const response = await axios.delete(`${url}/${itemId}`);
    return response.data;
  };

  return useMutation({
    mutationFn: deleteImage,
    onSuccess,
    onError,
    onMutate,
  });
};

export default useDeleteImages;
