import { useQueryClient } from "@tanstack/react-query";
import usePutRequest from "./usePutRequest";
import { useToast } from "@/components/ui/use-toast";
import { CommentFetchType, PostFetchType, PostType } from "@/typings/types";
import usePostRequest from "./usePostRequest";
import { MouseEvent, useEffect, useRef, useState, useMemo } from "react";
import {
  CommentInterface,
  PostInterface,
  ReplyInterface,
} from "@/typings/interfaces";
import { getSession } from "next-auth/react";
import { useAuthModal } from "./useAuthModal";
import { useSocket } from "@/context/SocketContext";

export const useInteractions = (
  post?: PostType,
  comment?: CommentInterface
) => {
  const postId = useRef(post?._id).current;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [commentContent, setCommentContent] = useState<string>("");
  const {
    requireAuth,
    isOpen: isAuthModalOpen,
    currentAction,
    closeModal,
    handleSuccess,
  } = useAuthModal();
  const [currentUser, setCurrentUser] = useState("");
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
    if (!currentUser || !likes?.length) return false;
    return likes.some((like: string) => like.toString() === currentUser);
  }, [currentUser, likes]);

  const amountOfLikes = useMemo(() => likes.length, [likes]);

  const bookmarked = useMemo(() => {
    if (!currentUser || !bookmarks?.length) return false;
    return bookmarks.some(
      (bookmark: string) => bookmark.toString() === currentUser
    );
  }, [currentUser, bookmarks]);

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
    async function getUserId() {
      const session = await getSession();
      if (session?.user?.id) {
        setCurrentUser(`${session.user.id}`);
      }
    }

    getUserId();
  }, []);
  useEffect(() => {
    if (comment && currentUser) {
      const userLikedComment =
        comment.likes?.some((like) => like.toString() === currentUser) ?? false;
      setCommentLiked(userLikedComment);
      setCommentLikesCount(comment.likes?.length ?? 0);
    }
  }, [comment, currentUser]);

  useEffect(() => {
    if (!socket || !comment) return;

    const handleCommentLikeUpdate = (data: {
      commentId: string;
      userId: string;
      isLiked: boolean;
    }) => {
      if (data.commentId === comment._id) {
        if (data.userId === currentUser) {
          setCommentLiked(data.isLiked);
        }

        setCommentLikesCount((prev) => {
          const currentLikes = comment.likes || [];
          const userAlreadyLiked = currentLikes.includes(data.userId);

          if (data.isLiked && !userAlreadyLiked) {
            return prev + 1;
          } else if (!data.isLiked && userAlreadyLiked) {
            return prev - 1;
          }
          return prev;
        });

        if (comment.likes) {
          if (data.isLiked && !comment.likes.includes(data.userId)) {
            comment.likes.push(data.userId);
          } else if (!data.isLiked) {
            comment.likes = comment.likes.filter((id) => id !== data.userId);
          }
        }
      }
    };

    socket.on("commentLikeUpdate", handleCommentLikeUpdate);

    return () => {
      socket.off("commentLikeUpdate", handleCommentLikeUpdate);
    };
  }, [socket, comment, currentUser]);
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
              const userIdString = currentUser;
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

        const userIdString = currentUser;
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
  const likeInteraction = (
    postId: string,
    { onError }: { onError?: () => void }
  ) => {
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
  };
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
              const userIdString = currentUser;
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

        const userIdString = currentUser;
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
  const bookmarkInteraction = (
    postId: string,
    { onError }: { onError?: () => void }
  ) => {
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
  };
  const createCommentMutation = usePostRequest({
    url: `/api/comments/${postId}`,
    onSuccess: (newComment) => {
      console.log("🎉 Comment created successfully:", newComment);

      // Update the comments cache with the new comment (for the author)
      queryClient.setQueryData<CommentInterface[]>(["comments"], (oldData) => {
        if (!oldData) return [newComment];

        // Check if comment already exists to avoid duplicates
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
        console.error("Reply data is incomplete:", newReply);
        return;
      }

      // Update the replies cache for the immediate parent's cache
      queryClient.setQueryData(
        [`replies-${newReply.parentId}`],
        (oldReplies: ReplyInterface[] | undefined) => {
          if (!oldReplies) return [newReply];

          // Check if reply already exists to avoid duplicates
          const exists = oldReplies.find((r) => r._id === newReply._id);
          if (exists) return oldReplies;

          return [...oldReplies, newReply];
        }
      );

      // Update the grandparent's replies cache
      queryClient.setQueryData(
        [`replies-${comment?.parentId}`],
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

      // Update the comments cache
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

      // Success Toast
      toast({
        title: "Success",
        description: "Your reply was successfully added.",
      });
    },
    onError: (error) => {
      // Error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add reply",
      });
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
          onError: (error) => {
            if (onError) onError();

            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to process the request. Please try again.";

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
  const likeCommentMutation = usePutRequest({
    url: `/api/comments/${postId}`,
    onSuccess: (_, variables: { commentId: string }) => {
      // No need to invalidate queries since we're using optimistic updates
      toast({
        title: "Success",
        description: "Your action was successful.",
      });
    },
    onError: (error, variables) => {
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

  const likeCommentInteraction = (
    commentId: string,
    { onError }: { onError?: () => void }
  ) => {
    requireAuth("like", () => {
      const previousLikedState = commentLiked;
      const previousLikesCount = commentLikesCount;

      setCommentLiked(!commentLiked);
      setCommentLikesCount((prev) => (commentLiked ? prev - 1 : prev + 1));

      likeCommentMutation.mutate(
        { commentId },
        {
          onError: () => {
            setCommentLiked(previousLikedState);
            setCommentLikesCount(previousLikesCount);
            if (onError) onError();
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to process the request. Please try again.",
            });
          },
        }
      );
    });
  };
  /* Functions to export */
  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    requireAuth("like", () => {
      likeInteraction(`${post?._id}`, {
        onError: () => {
          console.error("Error handling like interaction");
        },
      });
    });
  };

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    requireAuth("bookmark", () => {
      bookmarkInteraction(`${post?._id}`, {
        onError: () => {
          console.error("Error handling bookmark interaction");
        },
      });
    });
  };
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
