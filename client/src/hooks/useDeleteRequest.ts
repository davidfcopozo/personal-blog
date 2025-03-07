import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";

interface UseDeleteRequestOptions {
  url: string;
  onSuccess?: () => void;
  onError?: (err: AxiosError) => void;
}

interface DeleteVariables {
  itemId: string;
  key: string;
}

const useDeleteRequest = ({
  url,
  onSuccess,
  onError,
}: UseDeleteRequestOptions) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, data, status, error } = useMutation({
    mutationFn: async ({ itemId }: DeleteVariables) => {
      // e.g. final URL =>  "/api/images/12345"
      const response = await axios.delete(`${url}/${itemId}`);
      return response.data; // or important fields from response
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-images"] });

      onSuccess?.();
    },

    onError: (err: AxiosError, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-images"] });

      onError?.(err);

      if (!onError) {
        toast({
          variant: "destructive",
          title: "Delete Error",
          description: err.message || "Failed to delete item",
        });
      }
    },

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["user-images"] });
      const previousData = queryClient.getQueryData(["user-images"]);
      return { previousData };
    },
  });

  return { mutate, data, status, error };
};

export default useDeleteRequest;
