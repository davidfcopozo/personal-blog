import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import {
  DeleteImageProps,
  UseMutationRequestProps,
} from "@/typings/interfaces";
import apiClient from "@/utils/axiosIntance";

const useDeleteImages = ({
  url,
  onSuccess,
  onError,
  onMutate,
}: UseMutationRequestProps<any, any>) => {
  const deleteImage = async ({ itemId }: DeleteImageProps) => {
    try {
      // Ensure we have a valid itemId
      if (!itemId) {
        throw new Error("No image ID provided");
      }

      const encodedItemId = encodeURIComponent(itemId);
      const deleteUrl = `${url}?id=${encodedItemId}`;

      const headers = {
        "x-image-id": itemId, // Add the ID as a header as well
      };

      const response = await apiClient.delete(deleteUrl, { headers });
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
