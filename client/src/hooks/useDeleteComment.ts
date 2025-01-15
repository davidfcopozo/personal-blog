import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {
  CommentInterface,
  PostInterface,
  ReplyInterface,
} from "@/typings/interfaces";
import { PostFetchType, PostType } from "@/typings/types";

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
      if (key === "replies" && !parentId) {
        throw new Error("ParentId is required for deleting replies");
      }

      const finalUrl =
        key === "replies"
          ? `/api/replies/${post?._id}/${parentId}/${itemId}`
          : url;

      const res = await axios.delete(finalUrl);
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

      // Handle reply deletion
      if (variables.key === "replies" && variables.parentId) {
        // 1. Update the immediate parent's replies cache
        queryClient.setQueryData(
          [`replies-${variables.parentId}`],
          (oldReplies: ReplyInterface[]) => {
            if (!oldReplies || !Array.isArray(oldReplies)) return oldReplies;
            return oldReplies.filter(
              (reply) => reply._id.toString() !== variables.itemId
            );
          }
        );

        // 2. Update the parent comment's replies array in comments cache
        queryClient.setQueryData(
          ["comments"],
          (oldComments: CommentInterface[]) => {
            if (!oldComments || !Array.isArray(oldComments)) return oldComments;
            return oldComments.map((comment) => {
              if (comment._id.toString() === variables.parentId) {
                return {
                  ...comment,
                  replies: (comment.replies || []).filter(
                    (replyId) => replyId.toString() !== variables.itemId
                  ),
                };
              }
              return comment;
            });
          }
        );

        // 3. Get the parent comment to find grandparent ID
        const parentComment = queryClient
          .getQueryData<CommentInterface[]>(["comments"])
          ?.find((comment) => comment._id.toString() === variables.parentId);

        // 4. Update grandparent's replies cache if it exists
        if (parentComment?.parentId) {
          queryClient.setQueryData(
            [`replies-${parentComment.parentId}`],
            (oldReplies: ReplyInterface[]) => {
              if (!oldReplies || !Array.isArray(oldReplies)) return oldReplies;
              return oldReplies.map((reply) => {
                if (reply._id.toString() === variables.parentId) {
                  return {
                    ...reply,
                    replies: (reply.replies || []).filter(
                      (replyId) => replyId.toString() !== variables.itemId
                    ),
                  };
                }
                return reply;
              });
            }
          );
        }

        // 5. Remove the specific reply cache
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
      },
      context: any
    ) => {
      // Restore all previous states on error
      if (context) {
        const {
          previousComments,
          previousReplies,
          previousGrandparentReplies,
          previousPost,
        } = context;

        if (previousComments) {
          queryClient.setQueryData(["comments"], previousComments);
        }

        if (variables.parentId && previousReplies) {
          queryClient.setQueryData(
            [`replies-${variables.parentId}`],
            previousReplies
          );
        }

        if (variables.parentId && previousGrandparentReplies) {
          // Find parent comment to get grandparent ID
          const parentComment = previousComments?.find(
            (comment: CommentInterface) =>
              comment._id.toString() === variables.parentId
          );
          if (parentComment?.parentId) {
            queryClient.setQueryData(
              [`replies-${parentComment.parentId}`],
              previousGrandparentReplies
            );
          }
        }

        if (previousPost) {
          queryClient.setQueryData(["post", post?.slug], previousPost);
        }
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
      // Cancel all relevant queries
      await queryClient.cancelQueries({ queryKey: [variables.key] });
      if (variables.parentId) {
        await queryClient.cancelQueries({
          queryKey: [`replies-${variables.parentId}`],
        });
        // Find and cancel grandparent queries
        const parentComment = queryClient
          .getQueryData<CommentInterface[]>(["comments"])
          ?.find((comment) => comment._id.toString() === variables.parentId);
        if (parentComment?.parentId) {
          await queryClient.cancelQueries({
            queryKey: [`replies-${parentComment.parentId}`],
          });
        }
      }
      if (post?.slug) {
        await queryClient.cancelQueries({ queryKey: ["post", post.slug] });
      }

      // Store previous states
      const previousComments = queryClient.getQueryData(["comments"]);
      const previousReplies = variables.parentId
        ? queryClient.getQueryData([`replies-${variables.parentId}`])
        : null;
      const previousPost = post?.slug
        ? queryClient.getQueryData(["post", post.slug])
        : null;

      // Find the parent comment to get grandparent's replies
      const parentComment = queryClient
        .getQueryData<CommentInterface[]>(["comments"])
        ?.find((comment) => comment._id.toString() === variables.parentId);
      const previousGrandparentReplies = parentComment?.parentId
        ? queryClient.getQueryData([`replies-${parentComment.parentId}`])
        : null;

      // Perform optimistic updates for reply deletion
      if (variables.key === "replies" && variables.parentId) {
        // Update immediate parent's replies
        queryClient.setQueryData(
          [`replies-${variables.parentId}`],
          (old: ReplyInterface[]) => {
            if (!old || !Array.isArray(old)) return old;
            return old.filter(
              (reply) => reply._id.toString() !== variables.itemId
            );
          }
        );

        // Update comments cache
        queryClient.setQueryData(["comments"], (old: CommentInterface[]) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((comment) => {
            if (comment._id.toString() === variables.parentId) {
              return {
                ...comment,
                replies: (comment.replies || []).filter(
                  (replyId) => replyId.toString() !== variables.itemId
                ),
              };
            }
            return comment;
          });
        });

        // Update grandparent's replies if needed
        if (parentComment?.parentId) {
          queryClient.setQueryData(
            [`replies-${parentComment.parentId}`],
            (oldReplies: ReplyInterface[]) => {
              if (!oldReplies || !Array.isArray(oldReplies)) return oldReplies;
              return oldReplies.map((reply) => {
                if (reply._id.toString() === variables.parentId) {
                  return {
                    ...reply,
                    replies: (reply.replies || []).filter(
                      (replyId) => replyId.toString() !== variables.itemId
                    ),
                  };
                }
                return reply;
              });
            }
          );
        }

        // Remove the reply's own cache
        queryClient.removeQueries({
          queryKey: [`replies-${variables.itemId}`],
        });
      }

      // Return previous states for potential rollback
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
