import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";

const useDeleteRequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, data, status, error } = useMutation({
    mutationFn: async ({ url, itemId, key }: { url: string; itemId: string, key: string }) => {
      const res = await axios.delete(url);
      return { url: res.data.data, itemId, key  };
    },
    onSuccess: (variables: { url: string; itemId: string, key: string }) => {
      queryClient.invalidateQueries({ queryKey: [variables.key] });
      queryClient.invalidateQueries({
        queryKey: [variables.key, variables.itemId],
      });

      toast({
        title: "Success",
        description: "Successfully deleted",
      });
    },
    onError: (variables: { url: string; itemId: string, key: string }) => {
      queryClient.invalidateQueries({ queryKey: [variables.key] });
      queryClient.invalidateQueries({
        queryKey: [variables.key, variables.itemId],
      });

      const errorMessage =
        error &&
        typeof error === "object" &&
        "Failed to process the request. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    },
    onMutate: (variables: { url: string; itemId: string, key: string }) => {
        queryClient.cancelQueries({ queryKey: [variables.key] });
        const previousItems = queryClient.getQueryData([variables.key]);
        queryClient.setQueryData([variables.key], (old: any) => {
            return old.filter((item: any) => item._id !== variables.itemId);
        });
        return { previousItems };
    },
  });
  return { mutate, data, status, error };
};

export default useDeleteRequest;
