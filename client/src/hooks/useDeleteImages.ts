import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { UseMutationRequestProps } from "@/typings/interfaces";
import apiClient from "@/utils/axiosIntance";

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
      // Ensure we have a valid itemId
      if (!itemId) {
        throw new Error("No image ID provided");
      }

      const encodedItemId = encodeURIComponent(itemId);
      const deleteUrl = `${url}?id=${encodedItemId}`;

      console.log("Deleting image with URL:", deleteUrl);
      const headers = {
        "x-image-id": itemId, // Add the ID as a header as well
      };

      const response = await apiClient.delete(deleteUrl, { headers });
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
