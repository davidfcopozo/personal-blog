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
    onSuccess: (variables: { post: PostType }) => {
      queryClient.setQueryData(["posts"], (old: PostType[]) => {
        if (!old || !Array.isArray(old)) return old;

        return old.filter(
          (post) => post._id.toString() !== variables.post._id.toString()
        );
      });

      queryClient.removeQueries({ queryKey: ["posts", variables.post.slug] });

      toast({
        title: "Success",
        description: "Successfully deleted",
      });
    },
    onError: (
      error: any,
      variables: { post: PostType },
      context?: {
        previousPosts: PostType[] | undefined;
        previousPost: PostType | undefined;
      }
    ) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["posts", variables.post.slug],
      });

      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to process the request. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
    },
    onMutate: (variables: { post: PostType }) => {
      queryClient.cancelQueries({ queryKey: ["posts"] });
      queryClient.cancelQueries({ queryKey: ["posts", variables.post.slug] });

      const previousPosts = queryClient.getQueryData<PostType[]>(["posts"]);
      const previousPost = queryClient.getQueryData<PostType>([
        "posts",
        variables.post.slug,
      ]);

      queryClient.setQueryData(["posts"], (old: PostType[]) => {
        if (!old || !Array.isArray(old)) return old;

        return old.filter(
          (post) => post._id.toString() !== previousPost?._id.toString()
        );
      });

      queryClient.removeQueries({ queryKey: ["posts", previousPost?.slug] });

      return { previousPosts, previousPost };
    },
  });

  const deletePost = (post: PostType) => {
    deletePostMutation.mutate({ post });
  };

  return {
    deletePost,
    status: deletePostMutation.status,
    error: deletePostMutation.error,
  };
};

export default useDeletePost;
