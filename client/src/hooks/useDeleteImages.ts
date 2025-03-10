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
      // Ensure itemId is properly encoded and the URL is well-formed
      const encodedItemId = encodeURIComponent(itemId);
      const deleteUrl = `${url}?id=${encodedItemId}`;

      console.log("Deleting image with URL:", deleteUrl);

      const response = await axios.delete(deleteUrl);
      return response.data;
    } catch (error: unknown) {
      console.error("Delete image error:", error);
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
