import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {
  CommentInterface,
  PostInterface,
  ReplyInterface,
} from "@/typings/interfaces";
import { PostFetchType, PostType } from "@/typings/types";

const useUpdateComment = (post?: PostType) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, data, status, error } = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const res = await axios.patch(`/api/comments/${post?._id}/${commentId}`, {
        content,
      });
      return { ...res.data, commentId, content };
    },
    onSuccess: (data) => {
      // Update the comment in the comments cache
      queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
        if (!old || !Array.isArray(old)) return old;

        return old.map((comment) => {
          if (comment._id.toString() === data.commentId) {
            return {
              ...comment,
              content: data.content,
            };
          }
          return comment;
        });
      });

      // Update comment in replies cache if it's a reply
      const updatedComment = queryClient
        .getQueryData<CommentInterface[]>(["comments"])
        ?.find((comment) => comment._id.toString() === data.commentId);

      if (updatedComment?.isReply && updatedComment.parentId) {
        queryClient.setQueryData(
          [`replies-${updatedComment.parentId}`],
          (old: ReplyInterface[]) => {
            if (!old || !Array.isArray(old)) return old;

            return old.map((reply) => {
              if (reply._id.toString() === data.commentId) {
                return {
                  ...reply,
                  content: data.content,
                };
              }
              return reply;
            });
          }
        );

        // Also update in grandparent's replies cache if needed
        const parentComment = queryClient
          .getQueryData<CommentInterface[]>(["comments"])
          ?.find(
            (comment) => comment._id.toString() === updatedComment.parentId
          );

        if (parentComment?.parentId) {
          queryClient.setQueryData(
            [`replies-${parentComment.parentId}`],
            (old: ReplyInterface[]) => {
              if (!old || !Array.isArray(old)) return old;

              return old.map((reply) => {
                if (reply._id.toString() === data.commentId) {
                  return {
                    ...reply,
                    content: data.content,
                  };
                }
                return reply;
              });
            }
          );
        }
      }

      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update comment. Please try again.";

      console.error("Update comment error:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    },
  });

  return { mutate, data, status, error };
};

export default useUpdateComment;
