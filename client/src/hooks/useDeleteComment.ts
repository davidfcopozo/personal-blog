import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CommentInterface, ReplyInterface } from "@/typings/interfaces";
import { PostFetchType, PostType } from "@/typings/types";
import { PostInterface } from "../../../api/src/typings/models/post";

const useDeleteComment = (post?: PostType) => {
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

        // Remove the comment ID from the post cache
        if (post?.slug) {
          queryClient.setQueryData(["post", post.slug], (oldPost: any) => {
            if (!oldPost?.data) return oldPost;
            return {
              ...oldPost,
              data: {
                ...oldPost.data,
                comments: oldPost.data.comments.filter(
                  (commentId: string) => commentId !== variables.itemId
                ),
              },
            };
          });
        }

        // Update the posts list cache to remove the comment ID
        queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
          if (!oldPosts?.data) return oldPosts;
          const postList = Array.isArray(oldPosts.data)
            ? oldPosts.data
            : [oldPosts.data];
          return {
            ...oldPosts,
            data: postList.map((p: PostInterface) => {
              if (p._id?.toString() === post?._id?.toString()) {
                return {
                  ...p,
                  comments: (p.comments || []).filter(
                    (commentId) => commentId.toString() !== variables.itemId
                  ),
                };
              }
              return p;
            }),
          };
        });

        // Remove replies associated with this comment
        queryClient.removeQueries({
          queryKey: [`replies-${variables.itemId}`],
        });
      }

      // Handle reply deletion (rest of the reply handling code remains the same)
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

        queryClient.setQueryData(
          [`replies-${variables.parentId}`],
          (old: ReplyInterface[]) => {
            if (!old || !Array.isArray(old)) return old;
            return old.filter(
              (item) => item._id.toString() !== variables.itemId
            );
          }
        );

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
      if (post?.slug) {
        queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
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
      if (post?.slug) {
        await queryClient.cancelQueries({ queryKey: ["post", post.slug] });
      }

      // Capture previous state for potential rollback
      const previousComments = queryClient.getQueryData(["comments"]);
      const previousReplies = variables.parentId
        ? queryClient.getQueryData([`replies-${variables.parentId}`])
        : null;
      const previousGrandparentReplies = variables?.parentId
        ? queryClient.getQueryData([`replies-${variables?.parentId}`])
        : null;
      const previousPost = post?.slug
        ? queryClient.getQueryData(["post", post.slug])
        : null;

      // Optimistically remove the item
      if (variables.key === "comments") {
        // Update comments cache
        queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
          if (!old || !Array.isArray(old)) return old;
          return old.filter((comment) => {
            if (comment._id.toString() === variables.itemId) return false;
            return !comment.replies?.includes(variables.itemId);
          });
        });

        // Optimistically update post cache
        if (post?.slug) {
          queryClient.setQueryData(["post", post.slug], (oldPost: any) => {
            if (!oldPost?.data) return oldPost;
            return {
              ...oldPost,
              data: {
                ...oldPost.data,
                comments: oldPost.data.comments.filter(
                  (commentId: string) => commentId !== variables.itemId
                ),
              },
            };
          });
        }

        // Update posts list cache
        queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
          if (!oldPosts?.data) return oldPosts;
          const postList = Array.isArray(oldPosts.data)
            ? oldPosts.data
            : [oldPosts.data];
          return {
            ...oldPosts,
            data: postList.map((p: PostInterface) => {
              if (p._id?.toString() === post?._id?.toString()) {
                return {
                  ...p,
                  comments: (p.comments || []).filter(
                    (commentId) => commentId.toString() !== variables.itemId
                  ),
                };
              }
              return p;
            }),
          };
        });

        // Remove replies cache
        queryClient.removeQueries({
          queryKey: [`replies-${variables.itemId}`],
        });
      }

      // Rest of the reply handling code remains the same
      if (variables.key === "replies" && variables.parentId) {
        queryClient.setQueryData(
          [`replies-${variables.parentId}`],
          (old: ReplyInterface[]) => {
            if (!old || !Array.isArray(old)) return old;
            return old.filter(
              (item) => item._id.toString() !== variables.itemId
            );
          }
        );

        const parentComment = queryClient
          .getQueryData<CommentInterface[]>([`replies`])
          ?.find((comment) => comment._id.toString() === variables.parentId);

        queryClient.setQueryData(
          [`replies-${parentComment?.parentId}`],
          (oldReplies: ReplyInterface[] | undefined) => {
            return oldReplies?.map((reply) => {
              if (`${reply._id}` === `${variables.parentId}`) {
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

        queryClient.removeQueries({
          queryKey: [`replies-${variables.itemId}`],
        });
      }

      return {
        previousComments,
        previousReplies,
        previousGrandparentReplies,
        previousPost,
      };
    },
  });

  return { mutate, data, status, error };
};

export default useDeleteComment;
