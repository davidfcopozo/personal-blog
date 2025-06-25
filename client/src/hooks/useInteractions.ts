import { useQueryClient } from "@tanstack/react-query";
import usePutRequest from "./usePutRequest";
import { useToast } from "@/components/ui/use-toast";
import { CommentFetchType, PostFetchType, PostType } from "@/typings/types";
import usePostRequest from "./usePostRequest";
import {
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  CommentInterface,
  PostInterface,
  ReplyInterface,
} from "@/typings/interfaces";
import { useAuthModal } from "./useAuthModal";
import { useSocket } from "@/context/SocketContext";
import { useSessionUserId } from "./useSessionUserId";

export const useInteractions = (
  post?: PostType,
  comment?: CommentInterface
) => {
  const postId = useRef(post?._id).current;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { userId: currentUserId } = useSessionUserId(); // Use cached session approach
  const [commentContent, setCommentContent] = useState<string>("");
  const {
    requireAuth,
    isOpen: isAuthModalOpen,
    currentAction,
    closeModal,
    handleSuccess,
  } = useAuthModal();
  const cachedPostsData = queryClient.getQueryData<PostFetchType>(["posts"]);
  const cachedSinglePostData = queryClient.getQueryData<any>([
    "post",
    post?.slug,
  ]);

  const currentPostData = useMemo(() => {
    // First try to get from individual post cache (most up-to-date for single post pages)
    if (cachedSinglePostData?.data && cachedSinglePostData.data._id) {
      return cachedSinglePostData.data;
    }

    // Then try posts list cache
    if (
      cachedPostsData?.data &&
      Array.isArray(cachedPostsData.data) &&
      postId
    ) {
      return cachedPostsData.data.find(
        (p: PostInterface) => p._id.toString() === postId.toString()
      );
    }

    // Fallback to the original post prop
    return post;
  }, [cachedPostsData, cachedSinglePostData, post, postId]);

  const bookmarks = useMemo(
    () => currentPostData?.bookmarks ?? [],
    [currentPostData?.bookmarks]
  );
  const likes = useMemo(
    () => currentPostData?.likes ?? [],
    [currentPostData?.likes]
  );
  const liked = useMemo(() => {
    if (!currentUserId || !likes?.length) return false;
    return likes.some((like: string) => like.toString() === currentUserId);
  }, [currentUserId, likes]);

  const amountOfLikes = useMemo(() => likes.length, [likes]);

  const bookmarked = useMemo(() => {
    if (!currentUserId || !bookmarks?.length) return false;
    return bookmarks.some(
      (bookmark: string) => bookmark.toString() === currentUserId
    );
  }, [currentUserId, bookmarks]);

  const amountOfBookmarks = useMemo(() => bookmarks.length, [bookmarks]);
  const commentsCount = useMemo(
    () => currentPostData?.comments?.length ?? 0,
    [currentPostData?.comments]
  );
  const [commentLiked, setCommentLiked] = useState<boolean>(false);
  const [commentLikesCount, setCommentLikesCount] = useState<number>(
    comment?.likes?.length ?? 0
  );
  const [replyContent, setReplyContent] = useState<string>("");

  useEffect(() => {
    if (comment && currentUserId) {
      const userLikedComment =
        comment.likes?.some((like) => like.toString() === currentUserId) ??
        false;
      setCommentLiked(userLikedComment);
      setCommentLikesCount(comment.likes?.length ?? 0);
    }
  }, [comment, currentUserId]); // Watch for cache updates from socket events and update local state
  useEffect(() => {
    if (!comment?._id || !currentUserId) return;

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === "comments") {
        const cachedComments = queryClient.getQueryData<any>(["comments"]);
        if (cachedComments && Array.isArray(cachedComments)) {
          const updatedComment = cachedComments.find(
            (c: any) => c._id?.toString() === comment._id?.toString()
          );

          if (updatedComment) {
            const userLiked =
              updatedComment.likes?.some(
                (like: string) => like.toString() === currentUserId
              ) ?? false;
            const likesCount = updatedComment.likes?.length ?? 0;

            setCommentLiked((prev) => (prev !== userLiked ? userLiked : prev));
            setCommentLikesCount((prev) =>
              prev !== likesCount ? likesCount : prev
            );
          }
        }
      }
    });

    return unsubscribe;
  }, [comment?._id, currentUserId, queryClient]);
  const handleReplyContentChange = (content: string) => {
    setReplyContent(content);
  };
  const likeMutation = usePutRequest({
    url: "/api/posts/like",
    onSuccess: (_, variables: { postId: string }) => {
      toast({
        title: "Success",
        description: "Your action was successful.",
      });
    },
    onError: (error, _, context: any) => {
      // Revert optimistic update on error
      if (context?.previousPostsData) {
        queryClient.setQueryData(["posts"], context.previousPostsData);
      }
      if (context?.previousPostData) {
        queryClient.setQueryData(
          ["post", post?.slug],
          context.previousPostData
        );
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the request. Please try again.",
      });
    },
    onMutate: async (variables: { postId: string }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"], exact: true });
      await queryClient.cancelQueries({ queryKey: ["post", post?.slug] });

      const previousPostsData = queryClient.getQueryData<PostFetchType>([
        "posts",
      ]);
      const previousPostData = queryClient.getQueryData<any>([
        "post",
        post?.slug,
      ]);

      // Optimistically update the posts cache
      queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
        if (!oldPosts?.data || !Array.isArray(oldPosts.data)) {
          return oldPosts;
        }

        return {
          ...oldPosts,
          data: oldPosts.data.map((post: PostInterface) => {
            if (post._id?.toString() === variables.postId?.toString()) {
              const userIdString = currentUserId;
              const isLiked = post.likes?.some(
                (like) => like.toString() === userIdString
              );

              return {
                ...post,
                likes: isLiked
                  ? post.likes?.filter(
                      (like) => like.toString() !== userIdString
                    ) || []
                  : [...(post.likes || []), userIdString],
              };
            }
            return post;
          }),
        };
      });

      // Optimistically update the single post cache
      queryClient.setQueryData(["post", post?.slug], (oldPost: any) => {
        if (!oldPost?.data) return oldPost;

        const userIdString = currentUserId;
        const isLiked = oldPost.data.likes?.some(
          (like: string) => like.toString() === userIdString
        );

        return {
          ...oldPost,
          data: {
            ...oldPost.data,
            likes: isLiked
              ? oldPost.data.likes?.filter(
                  (like: string) => like.toString() !== userIdString
                ) || []
              : [...(oldPost.data.likes || []), userIdString],
          },
        };
      });

      return { previousPostsData, previousPostData } as any;
    },
  });
  const likeInteraction = useCallback(
    (postId: string, { onError }: { onError?: () => void }) => {
      likeMutation.mutate(
        { postId },
        {
          onError: (error) => {
            if (onError) onError();
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to process the request. Please try again.",
            });
          },
        }
      );
    },
    [likeMutation, toast]
  );
  const bookmarkMutation = usePutRequest({
    url: "/api/posts/bookmark",
    onSuccess: (_, variables: { postId: string }) => {
      toast({
        title: "Success",
        description: "Your action was successful.",
      });
    },
    onError: (error, _, context: any) => {
      // Revert optimistic update on error
      if (context?.previousPostsData) {
        queryClient.setQueryData(["posts"], context.previousPostsData);
      }
      if (context?.previousPostData) {
        queryClient.setQueryData(
          ["post", post?.slug],
          context.previousPostData
        );
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the request. Please try again.",
      });
    },
    onMutate: async (variables: { postId: string }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"], exact: true });
      await queryClient.cancelQueries({ queryKey: ["post", post?.slug] });

      const previousPostsData = queryClient.getQueryData<PostFetchType>([
        "posts",
      ]);
      const previousPostData = queryClient.getQueryData<any>([
        "post",
        post?.slug,
      ]);

      // Optimistically update the posts cache
      queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
        if (!oldPosts?.data || !Array.isArray(oldPosts.data)) {
          return oldPosts;
        }

        return {
          ...oldPosts,
          data: oldPosts.data.map((post: PostInterface) => {
            if (post._id?.toString() === variables.postId?.toString()) {
              const userIdString = currentUserId;
              const isBookmarked = post.bookmarks?.some(
                (bookmark) => bookmark.toString() === userIdString
              );

              return {
                ...post,
                bookmarks: isBookmarked
                  ? post.bookmarks?.filter(
                      (bookmark) => bookmark.toString() !== userIdString
                    ) || []
                  : [...(post.bookmarks || []), userIdString],
              };
            }
            return post;
          }),
        };
      });

      // Optimistically update the single post cache
      queryClient.setQueryData(["post", post?.slug], (oldPost: any) => {
        if (!oldPost?.data) return oldPost;

        const userIdString = currentUserId;
        const isBookmarked = oldPost.data.bookmarks?.some(
          (bookmark: string) => bookmark.toString() === userIdString
        );

        return {
          ...oldPost,
          data: {
            ...oldPost.data,
            bookmarks: isBookmarked
              ? oldPost.data.bookmarks?.filter(
                  (bookmark: string) => bookmark.toString() !== userIdString
                ) || []
              : [...(oldPost.data.bookmarks || []), userIdString],
          },
        };
      });

      return { previousPostsData, previousPostData } as any;
    },
  });
  const bookmarkInteraction = useCallback(
    (postId: string, { onError }: { onError?: () => void }) => {
      bookmarkMutation.mutate(
        { postId },
        {
          onError: (error) => {
            if (onError) onError();
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to process the request. Please try again.",
            });
          },
        }
      );
    },
    [bookmarkMutation, toast]
  );
  const createCommentMutation = usePostRequest({
    url: `/api/comments/${postId}`,
    onSuccess: (newComment) => {
      // Update the comments cache with the new comment (for the author)
      queryClient.setQueryData<CommentInterface[]>(["comments"], (oldData) => {
        if (!oldData) return [newComment];

        const exists = oldData.find((c) => c._id === newComment._id);
        if (exists) return oldData;

        return [...oldData, newComment];
      });

      // Update posts cache to increment comment count
      queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
        if (!oldPosts?.data) return oldPosts;
        const postList = Array.isArray(oldPosts.data)
          ? oldPosts.data
          : [oldPosts.data];
        return {
          ...oldPosts,
          data: postList.map((post: PostInterface) => {
            if (post._id?.toString() === postId?.toString()) {
              const existingComments = post.comments || [];
              if (!existingComments.includes(newComment._id)) {
                return {
                  ...post,
                  comments: [...existingComments, newComment._id],
                };
              }
            }
            return post;
          }),
        };
      });

      // Update single post cache if it exists
      queryClient.setQueryData(["post", post?.slug], (oldPost: any) => {
        if (!oldPost?.data) return oldPost;

        const existingComments = oldPost.data.comments || [];
        if (!existingComments.includes(newComment._id)) {
          return {
            ...oldPost,
            data: {
              ...oldPost.data,
              comments: [...existingComments, newComment._id],
            },
          };
        }

        return oldPost;
      });

      setCommentContent("");
    },

    onError: (error) => {
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
  });

  const createCommentInteraction = ({ onError }: { onError?: () => void }) => {
    requireAuth("comment", () => {
      createCommentMutation.mutate(
        { _id: postId, content: commentContent },
        {
          onError: (error) => {
            if (onError) onError();
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
        }
      );
    });
  };

  const createReplyMutation = usePostRequest({
    url: `/api/replies/${postId}`,
    onSuccess: (newReply: ReplyInterface) => {
      if (!newReply || !newReply.parentId || !newReply._id) {
        return;
      }

      // Find and update the correct query keys for the specific parent
      const queriesForParent = queryClient.getQueryCache().findAll({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) &&
            queryKey.length === 2 &&
            queryKey[0] === `replies-${newReply.parentId}` &&
            Array.isArray(queryKey[1])
          );
        },
      });

      queriesForParent.forEach((query) => {
        queryClient.setQueryData(
          query.queryKey,
          (oldReplies: ReplyInterface[] | undefined) => {
            if (!oldReplies) return [newReply];

            const exists = oldReplies.find((r) => r._id === newReply._id);
            if (exists) return oldReplies;

            return [...oldReplies, newReply];
          }
        );
      });

      queryClient.setQueryData(
        ["replies"],
        (oldReplies: ReplyInterface[] | undefined) => {
          if (!oldReplies) return [newReply];

          const exists = oldReplies.find((r) => r._id === newReply._id);
          if (exists) return oldReplies;

          return [...oldReplies, newReply];
        }
      );

      // Update the grandparent's replies cache if this is a nested reply
      if (comment?.parentId) {
        const grandparentQueries = queryClient.getQueryCache().findAll({
          predicate: (query) => {
            const queryKey = query.queryKey;
            return (
              Array.isArray(queryKey) &&
              queryKey.length === 2 &&
              queryKey[0] === `replies-${comment.parentId}` &&
              Array.isArray(queryKey[1])
            );
          },
        });

        grandparentQueries.forEach((query) => {
          queryClient.setQueryData(
            query.queryKey,
            (oldReplies: ReplyInterface[] | undefined) => {
              return oldReplies?.map((reply) => {
                if (`${reply._id}` === `${newReply.parentId}`) {
                  const currentReplies = reply.replies || [];
                  if (!currentReplies.includes(`${newReply._id}`)) {
                    return {
                      ...reply,
                      replies: [...currentReplies, `${newReply._id}`],
                    };
                  }
                }
                return reply;
              });
            }
          );
        });
      }

      // Update the comments cache to include the new reply ID
      queryClient.setQueryData(
        ["comments"],
        (oldComments: CommentInterface[] | undefined) => {
          if (!oldComments) {
            return oldComments;
          }

          return oldComments.map((comment) => {
            if (comment._id.toString() === newReply.parentId) {
              const currentReplies = comment.replies || [];
              if (!currentReplies.includes(`${newReply._id}`)) {
                return {
                  ...comment,
                  replies: [...currentReplies, `${newReply._id}`],
                };
              }
            }
            return comment;
          });
        }
      );

      setReplyContent("");

      toast({
        title: "Success",
        description: "Your reply was successfully added.",
      });
    },
    onError: (error: any) => {
      // Check if error indicates parent comment not found
      const errorMsg = error?.response?.data?.message || error?.message || "";
      const isParentNotFound =
        errorMsg.toLowerCase().includes("not found") ||
        errorMsg.toLowerCase().includes("deleted") ||
        errorMsg.toLowerCase().includes("parent") ||
        error?.response?.status === 404;

      if (isParentNotFound) {
        toast({
          variant: "destructive",
          title: "Comment Not Found",
          description:
            "The comment you're trying to reply to has been deleted or no longer exists.",
        });

        // Remove the parent comment from cache if it doesn't exist
        if (comment?._id) {
          queryClient.setQueryData(["comments"], (oldData: any) => {
            if (!oldData || !Array.isArray(oldData)) {
              return oldData;
            }
            return oldData.filter(
              (c: any) => c._id?.toString() !== comment._id
            );
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add reply. Please try again.",
        });
      }
    },
  });

  const createReplyInteraction = ({ onError }: { onError?: () => void }) => {
    if (!postId || !comment?._id || !replyContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing required information to create reply.",
      });
      return;
    }

    requireAuth("reply", () => {
      createReplyMutation.mutate(
        { parentId: comment._id, content: replyContent.trim() },
        {
          onError: (error: any) => {
            if (onError) onError();

            const errorMsg =
              error?.response?.data?.message || error?.message || "";
            const isParentNotFound =
              errorMsg.toLowerCase().includes("not found") ||
              errorMsg.toLowerCase().includes("deleted") ||
              error?.response?.status === 404;

            if (isParentNotFound) {
              toast({
                variant: "destructive",
                title: "Comment Not Found",
                description:
                  "The comment you're trying to reply to has been deleted or no longer exists.",
              });

              // Remove the parent comment from cache if it doesn't exist
              queryClient.setQueryData(["comments"], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData)) {
                  return oldData;
                }
                return oldData.filter(
                  (c: any) => c._id?.toString() !== comment._id
                );
              });
            } else {
              const errorMessage =
                errorMsg || "Failed to process the request. Please try again.";
              toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
              });
            }
          },
        }
      );
    });
  };

  const likeCommentMutation = usePutRequest({
    url: `/api/comments/${postId}`,
    onSuccess: (response: any, variables: { commentId: string }) => {
      toast({
        title: "Success",
        description: "Your action was successful.",
      });
    },
    onError: (error: any, variables, context: any) => {
      // Revert optimistic update on error
      if (context?.previousCommentsData) {
        queryClient.setQueryData(["comments"], context.previousCommentsData);
      }
      if (context?.previousReplyCaches) {
        // Restore reply caches
        context.previousReplyCaches.forEach(({ queryKey, data }: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousRepliesData) {
        queryClient.setQueryData(["replies"], context.previousRepliesData);
      }

      const errorMsg = error?.response?.data?.message || error?.message || "";
      const isCommentNotFound =
        errorMsg.toLowerCase().includes("not found") ||
        errorMsg.toLowerCase().includes("deleted") ||
        error?.response?.status === 404;

      if (isCommentNotFound) {
        toast({
          variant: "destructive",
          title: "Comment Not Found",
          description: "This comment has been deleted or no longer exists.",
        });

        // Remove the comment from cache if it doesn't exist
        queryClient.setQueryData(["comments"], (oldData: any) => {
          if (!oldData || !Array.isArray(oldData)) {
            return oldData;
          }
          return oldData.filter(
            (comment: any) => comment._id?.toString() !== variables.commentId
          );
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process the request. Please try again.",
        });
      }
    },
    onMutate: async (variables: { commentId: string }) => {
      await queryClient.cancelQueries({ queryKey: ["comments"], exact: true });

      const previousCommentsData = queryClient.getQueryData<any>(["comments"]);
      const previousRepliesData = queryClient.getQueryData<any>(["replies"]);

      // Store all reply cache data for rollback
      const replyQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) &&
            queryKey.length === 2 &&
            typeof queryKey[0] === "string" &&
            queryKey[0].startsWith("replies-") &&
            Array.isArray(queryKey[1])
          );
        },
      });

      const previousReplyCaches = replyQueries.map((query) => ({
        queryKey: query.queryKey,
        data: queryClient.getQueryData(query.queryKey),
      }));

      // Optimistically update the comments cache
      queryClient.setQueryData(["comments"], (oldComments: any) => {
        if (!oldComments || !Array.isArray(oldComments)) {
          return oldComments;
        }

        return oldComments.map((comment: any) => {
          if (comment._id?.toString() === variables.commentId) {
            const userIdString = currentUserId;
            const isLiked = comment.likes?.some(
              (like: string) => like.toString() === userIdString
            );

            return {
              ...comment,
              likes: isLiked
                ? comment.likes?.filter(
                    (like: string) => like.toString() !== userIdString
                  ) || []
                : [...(comment.likes || []), userIdString],
            };
          }
          return comment;
        });
      });

      // Optimistically update reply caches
      replyQueries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldReplies: any) => {
          if (!oldReplies || !Array.isArray(oldReplies)) {
            return oldReplies;
          }

          return oldReplies.map((reply: any) => {
            if (reply._id?.toString() === variables.commentId) {
              const userIdString = currentUserId;
              const isLiked = reply.likes?.some(
                (like: string) => like.toString() === userIdString
              );

              return {
                ...reply,
                likes: isLiked
                  ? reply.likes?.filter(
                      (like: string) => like.toString() !== userIdString
                    ) || []
                  : [...(reply.likes || []), userIdString],
              };
            }
            return reply;
          });
        });
      });

      // Optimistically update global replies cache
      queryClient.setQueryData(["replies"], (oldReplies: any) => {
        if (!oldReplies || !Array.isArray(oldReplies)) {
          return oldReplies;
        }

        return oldReplies.map((reply: any) => {
          if (reply._id?.toString() === variables.commentId) {
            const userIdString = currentUserId;
            const isLiked = reply.likes?.some(
              (like: string) => like.toString() === userIdString
            );

            return {
              ...reply,
              likes: isLiked
                ? reply.likes?.filter(
                    (like: string) => like.toString() !== userIdString
                  ) || []
                : [...(reply.likes || []), userIdString],
            };
          }
          return reply;
        });
      });

      return {
        previousCommentsData,
        previousReplyCaches,
        previousRepliesData,
      } as any;
    },
  });
  const likeCommentInteraction = (
    commentId: string,
    { onError }: { onError?: () => void }
  ) => {
    // Prevent double clicks while mutation is in progress
    if (likeCommentMutation.status === "pending") {
      return;
    }

    requireAuth("like", () => {
      likeCommentMutation.mutate(
        { commentId },
        {
          onError: (error: any) => {
            if (onError) onError();

            // Error handling is done in the mutation's onError
          },
        }
      );
    });
  };

  const handleLikeClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!currentUserId) {
        requireAuth("like", () => {});
        return;
      }
      likeInteraction(`${postId}`, {
        onError: () => {
          console.error("Error handling like interaction");
        },
      });
    },
    [currentUserId, postId, likeInteraction, requireAuth]
  );

  const handleBookmarkClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!currentUserId) {
        requireAuth("bookmark", () => {});
        return;
      }
      bookmarkInteraction(`${postId}`, {
        onError: () => {
          console.error("Error handling bookmark interaction");
        },
      });
    },
    [currentUserId, postId, bookmarkInteraction, requireAuth]
  );

  return {
    handleLikeClick,
    handleBookmarkClick,
    likeInteraction,
    likeStatus: likeMutation.status,
    liked,
    amountOfLikes,
    bookmarkInteraction,
    bookmarked,
    amountOfBookmarks,
    commentsCount: currentPostData?.comments?.length ?? 0,
    createCommentInteraction,
    commentContent,
    commentMutationStatus: createCommentMutation.status,
    setCommentContent,
    likeCommentInteraction,
    commentLiked,
    commentLikesCount,
    handleReplyContentChange,
    createReplyInteraction,
    replyMutationStatus: createReplyMutation.status,
    setReplyContent,
    replyContent,
    // Auth modal properties
    isAuthModalOpen,
    authModalAction: currentAction,
    closeAuthModal: closeModal,
    handleAuthSuccess: handleSuccess,
    requireAuth,
  };
};
