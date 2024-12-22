import { useToast } from "@/components/ui/use-toast";
import { PostType } from "@/typings/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useDeletePost = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (variables: { post: PostType }) => {
      const res = await axios.delete(`/api/posts/${variables.post._id}`);
      return res.data.data;
    },
    onMutate: async (variables: { post: PostType }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<PostType[]>(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => {
        const newData =
          old?.data?.filter(
            (post: PostType) => post._id !== variables.post._id
          ) || [];
        return { data: newData };
      });

      return { previousPosts };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post",
      });
    },
    // Disable automatic refetch on success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    deletePost: (post: PostType) => deletePostMutation.mutate({ post }),
    status: deletePostMutation.status,
    error: deletePostMutation.error,
  };
};

export default useDeletePost;
