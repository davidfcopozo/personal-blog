import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CommentInterface, ReplyInterface } from "@/typings/interfaces";

const useDeleteComment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, data, status, error } = useMutation({
    mutationFn: async ({
      url,
      itemId,
      key,
      parentId,
    }: {
      url: string;
      itemId: string;
      key: string;
      parentId?: string;
    }) => {
      const res = await axios.delete(url);
      return { url: res.data.data, itemId, key, parentId };
    },
    onSuccess: (variables: {
      url: string;
      itemId: string;
      key: string;
      parentId?: string;
    }) => {
      // Handle comment deletion
      if (variables.key === "comments") {
        queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
          if (!old || !Array.isArray(old)) return old;
          // Filter out the comment and any of its replies
          return old.filter((comment) => {
            // Remove the comment itself
            if (comment._id.toString() === variables.itemId) return false;

            // Remove any replies associated with this comment
            return !comment.replies?.includes(variables.itemId);
          });
        });

        // Remove replies associated with this comment
        queryClient.removeQueries({
          queryKey: [`replies-${variables.itemId}`],
        });
      }

      // Handle reply deletion
      if (variables.key === "replies" && variables.parentId) {
        // Remove the reply from the specific comment's replies list
        queryClient.setQueryData(
          [`replies-${variables.parentId}`],
          (old: ReplyInterface[]) => {
            if (!old || !Array.isArray(old)) return old;
            return old.filter(
              (item) => item._id.toString() !== variables.itemId
            );
          }
        );

        // Remove the reply ID from the parent comment's replies array
        queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
          if (!old || !Array.isArray(old)) return old;

          return old.map((comment) => {
            if (comment._id.toString() === variables.parentId) {
              return {
                ...comment,
                replies: comment.replies
                  ? comment.replies.filter(
                      (replyId: string) => replyId !== variables.itemId
                    )
                  : [],
              };
            }
            return comment;
          });
        });
      }

      toast({
        title: "Success",
        description: "Successfully deleted",
      });
    },
    onError: (
      error: any,
      variables: {
        url: string;
        itemId: string;
        key: string;
        parentId?: string;
      }
    ) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [variables.key] });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", variables.parentId],
        });
      }

      const errorMessage =
        error.response?.data?.message ||
        "Failed to process the request. Please try again.";

      console.error("Delete error:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    },
    onMutate: async (variables: {
      url: string;
      itemId: string;
      key: string;
      parentId?: string;
    }) => {
      // Cancel any ongoing refetches
      await queryClient.cancelQueries({ queryKey: [variables.key] });
      if (variables.parentId) {
        await queryClient.cancelQueries({
          queryKey: ["replies", variables.parentId],
        });
      }

      const previousComments = queryClient.getQueryData(["comments"]);
      const previousReplies = variables.parentId
        ? queryClient.getQueryData([`replies-${variables.parentId}`])
        : null;

      // Optimistically remove the item
      if (variables.key === "comments") {
        queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
          if (!old || !Array.isArray(old)) return old;
          return old.filter((comment) => {
            if (comment._id.toString() === variables.itemId) return false;
            return !comment.replies?.includes(variables.itemId);
          });
        });
      }

      if (variables.key === "replies" && variables.parentId) {
        // Remove reply from specific replies list
        queryClient.setQueryData(
          [`replies-${variables.parentId}`],
          (old: ReplyInterface[]) => {
            if (!old || !Array.isArray(old)) return old;
            return old.filter(
              (item) => item._id.toString() !== variables.itemId
            );
          }
        );
      }

      return {
        previousComments,
        previousReplies,
      };
    },
  });

  return { mutate, data, status, error };
};

export default useDeleteComment;
