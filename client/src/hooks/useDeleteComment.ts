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
        // Remove the comment from comments cache
        queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
          if (!old || !Array.isArray(old)) return old;

          return old.filter((comment) => {
            // Remove the comment itself
            if (comment._id.toString() === variables.itemId) return false;

            // Keep comments that don't have the deleted comment in their replies
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
        // Update the grandparent's replies cache

        const parentComment = queryClient
          .getQueryData<CommentInterface[]>([`replies`])
          ?.find((comment) => comment._id.toString() === variables.parentId);

        queryClient.setQueryData(
          [`replies-${parentComment?.parentId}`],
          (oldReplies: ReplyInterface[] | undefined) => {
            return oldReplies?.map((reply) => {
              if (`${reply._id}` === `${variables.parentId}`) {

                // Remove the reply ID from the replies array
                return {
                  ...reply,
                  replies: (reply.replies || []).filter(
                    (replyId) => `${replyId}` !== variables.itemId
                  ),
                };
              }
              return reply;
            });
          }
        );

        // Remove the reply from its parent's replies list
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

        // Important: Remove the specific reply query cache
        queryClient.removeQueries({
          queryKey: [`replies-${variables.itemId}`],
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

      // Capture previous state for potential rollback
      const previousComments = queryClient.getQueryData(["comments"]);
      const previousReplies = variables.parentId
        ? queryClient.getQueryData([`replies-${variables.parentId}`])
        : null;
      const previousGrandparentReplies = variables?.parentId
        ? queryClient.getQueryData([`replies-${variables?.parentId}`])
        : null;

      // Optimistically remove the item
      if (variables.key === "comments") {
        queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
          if (!old || !Array.isArray(old)) return old;
          return old.filter((comment) => {
            // Remove the comment itself
            if (comment._id.toString() === variables.itemId) return false;

            // Remove any references to the deleted comment
            return !comment.replies?.includes(variables.itemId);
          });
        });

        // Remove all replies associated with the deleted comment
        queryClient.removeQueries({
          queryKey: [`replies-${variables.itemId}`],
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

        // Update grandparent's replies if needed
        const parentComment = queryClient
          .getQueryData<CommentInterface[]>([`replies`])
          ?.find((comment) => comment._id.toString() === variables.parentId);

        queryClient.setQueryData(
          [`replies-${parentComment?.parentId}`],
          (oldReplies: ReplyInterface[] | undefined) => {
            return oldReplies?.map((reply) => {
              if (`${reply._id}` === `${variables.parentId}`) {
                // Remove the reply ID from the replies array
                return {
                  ...reply,
                  replies: (reply.replies || []).filter(
                    (replyId) => replyId !== variables.itemId
                  ),
                };
              }
              return reply;
            });
          }
        );

        // Remove nested replies cache
        queryClient.removeQueries({
          queryKey: [`replies-${variables.itemId}`],
        });
      }

      return {
        previousComments,
        previousReplies,
        previousGrandparentReplies,
      };
    },
  });

  return { mutate, data, status, error };
};

export default useDeleteComment;
