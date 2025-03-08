import axios, { AxiosError } from "axios";
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
    try {
      const response = await axios.delete(`${url}?id=${itemId}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ msg?: string }>;
      throw new Error(
        axiosError.response?.data?.msg || "Failed to delete image"
      );
    }
  };

  const mutation = useMutation({
    mutationFn: deleteImage,
    onSuccess,
    onError,
    onMutate,
  });

  return {
    ...mutation,
    error: mutation.error,
  };
};

export default useDeleteImages;
