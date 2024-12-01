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
      // Update main list of comments/replies
      queryClient.setQueryData([variables.key], (old: any) => {
        if (!old || !Array.isArray(old)) return old;
        return old.filter((item: any) => item._id !== variables.itemId);
      });

      // If it's a reply, update the parent comment's replies
      if (variables.key === "replies" && variables.parentId) {
        queryClient.setQueryData(
          [`replies-${variables.parentId}`],
          (old: any) => {
            if (!old || !Array.isArray(old)) return old;
            return old.filter((item: any) => item._id !== variables.itemId);
          }
        );

        //remove reply from comment's replies list
        queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
          if (!old || !Array.isArray(old)) return old;

          // Map through comments and update the specific comment's replies
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

      // Snapshot the current data
      const previousItems = queryClient.getQueryData([variables.key]);
      const previousReplies = variables.parentId
        ? queryClient.getQueryData(["replies", variables.parentId])
        : null;

      // Optimistically update the UI
      queryClient.setQueryData([variables.key], (old: any) => {
        if (!old || !Array.isArray(old)) return old;
        return old.filter((item: any) => item._id !== variables.itemId);
      });

      // If it's a reply, also update the parent comment's replies
      if (variables.key === "replies" && variables.parentId) {
        queryClient.setQueryData(
          ["replies", variables.parentId],
          (old: any) => {
            if (!old || !Array.isArray(old)) return old;
            return old.filter((item: any) => item._id !== variables.itemId);
          }
        );
      }

      return {
        previousItems,
        previousReplies,
      };
    },
  });

  return { mutate, data, status, error };
};

export default useDeleteComment;
