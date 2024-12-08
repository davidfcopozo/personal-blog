import { useQueryClient } from "@tanstack/react-query";
import usePutRequest from "./usePutRequest";
import { useToast } from "@/components/ui/use-toast";
import { CommentFetchType, PostFetchType, PostType } from "@/typings/types";
import { ObjectId } from "mongoose";
import { PostInterface } from "../../../api/src/typings/models/post";
import usePostRequest from "./usePostRequest";
import { useEffect, useRef, useState } from "react";
import { CommentInterface, ReplyInterface } from "@/typings/interfaces";
import { getSession } from "next-auth/react";

export const useInteractions = (
  id?: string,
  post?: PostType,
  comment?: CommentInterface
) => {
  const postId = useRef(id).current;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState<string>("");

  const [liked, setLiked] = useState(false);
  const [amountOfLikes, setAmountOfLikes] = useState(0);
  const [currentUser, setCurrentUser] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [amountOfBookmarks, setAmountOfBookmarks] = useState(0);
  const bookmarks = post?.bookmarks ?? [];
  const likes = post?.likes ?? [];
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
    if (currentUser && likes?.length) {
      const userLiked = likes.some((like) => like.toString() === currentUser);
      setLiked(userLiked);
      setAmountOfLikes(likes.length);
    }

    if (currentUser && bookmarks?.length) {
      const userBookmarked = bookmarks.some(
        (bookmark) => bookmark.toString() === currentUser
      );
      setBookmarked(userBookmarked);
      setAmountOfBookmarks(bookmarks.length);
    }

    if (comment && currentUser) {
      const userLikedComment =
        comment.likes?.some((like) => like.toString() === currentUser) ?? false;
      setCommentLiked(userLikedComment);
      setCommentLikesCount(comment.likes?.length ?? 0);
    }

    if (currentUser && comment) {
      const userLikedComment =
        comment.likes?.some((like) => like.toString() === currentUser) ?? false;
      setCommentLiked(userLikedComment);
      setCommentLikesCount(comment.likes?.length ?? 0);
    }
  }, [currentUser, likes, bookmarks, comment]);

  const handleReplyContentChange = (content: string) => {
    setReplyContent(content);
  };

  const likeMutation = usePutRequest({
    url: "/api/posts/like",
    onSuccess: (_, variables: { postId: string }) => {
      const postsData = queryClient.getQueryData<PostFetchType>(["posts"]);

      if (postsData?.data) {
        // Update the specific post in the cached data to avoid full refetch of posts with query validation
        const updatedPosts = {
          ...postsData,
          data: postsData.data.map((post: PostInterface) => {
            if (post._id.toString() === variables.postId.toString()) {
              const userId = queryClient.getQueryData<{
                data: { _id: ObjectId };
              }>(["currentUser"])?.data._id;
              const userIdString = userId?.toString();
              const isLiked = post.likes?.some(
                (like) => like.toString() === userIdString
              );

              return {
                ...post,
                likes: isLiked
                  ? post.likes?.filter(
                      (like) => like.toString() !== userIdString
                    )
                  : [...(post.likes || []), userId!],
              };
            }
            return post;
          }),
        };

        // Set the updated data back in the cache
        queryClient.setQueryData(["posts"], updatedPosts);
      }

      toast({
        title: "Success",
        description: "Your action was successful.",
      });
    },
    onError: (error) => {
      //Error during mutation
      const previousPosts = queryClient.getQueryData<PostFetchType>(["posts"]);
      queryClient.setQueryData(["posts"], previousPosts);

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
    onMutate: async (postId: object) => {
      await queryClient.cancelQueries({ queryKey: ["posts"], exact: true });

      const previousPostsData = queryClient.getQueryData<PostFetchType>([
        "posts",
      ]);
      const previousPosts = previousPostsData?.data;
      if (!Array.isArray(previousPosts)) {
        return { previousData: previousPosts };
      }

      queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
        if (!Array.isArray(oldPosts?.data)) {
          return oldPosts;
        }

        return {
          ...oldPosts,
          data: oldPosts.data.map((post: PostInterface) => {
            if (post._id.toString() === postId.toString()) {
              const userId = queryClient.getQueryData<{
                data: { _id: ObjectId };
              }>(["currentUser"])?.data._id;
              const userIdString = userId?.toString();
              const isLiked = post.likes?.some(
                (like) => like.toString() === userIdString
              );

              return {
                ...post,
                likes: isLiked
                  ? post.likes?.filter(
                      (like) => like.toString() !== userIdString
                    )
                  : [...(post.likes || []), userId!],
              };
            }
            return post;
          }),
        };
      });

      return { previousData: previousPosts };
    },
  });

  const likeInteraction = (
    postId: string,
    { onError }: { onError?: () => void }
  ) => {
    const previousLikedState = liked;
    const previousLikesCount = amountOfLikes;

    setLiked(!liked);
    setAmountOfLikes((prev) => (liked ? prev - 1 : prev + 1));

    likeMutation.mutate(
      { postId },
      {
        onError: (error) => {
          setLiked(previousLikedState);
          setAmountOfLikes(previousLikesCount);
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
      const postsData = queryClient.getQueryData<PostFetchType>(["posts"]);

      if (postsData?.data) {
        // Update the specific post in the cached data to avoid full refetch of posts with query validation
        const updatedPosts = {
          ...postsData,
          data: postsData.data.map((post: PostInterface) => {
            if (post._id.toString() === variables.postId.toString()) {
              const userId = queryClient.getQueryData<{
                data: { _id: ObjectId };
              }>(["currentUser"])?.data._id;
              const userIdString = userId?.toString();
              const isBookmarked = post.bookmarks?.some(
                (bookmark) => bookmark.toString() === userIdString
              );

              return {
                ...post,
                bookmarks: isBookmarked
                  ? post.bookmarks?.filter(
                      (bookmark) => bookmark.toString() !== userIdString
                    )
                  : [...(post.bookmarks || []), userId!],
              };
            }
            return post;
          }),
        };

        // Set the updated data back in the cache
        queryClient.setQueryData(["posts"], updatedPosts);
      }

      toast({
        title: "Success",
        description: "Your action was successful.",
      });
    },
    onError: (error) => {
      //Error during mutation
      const previousPosts = queryClient.getQueryData<PostFetchType>(["posts"]);
      queryClient.setQueryData(["posts"], previousPosts);

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
    onMutate: async (postId: object) => {
      await queryClient.cancelQueries({ queryKey: ["posts"], exact: true });

      const previousPostsData = queryClient.getQueryData<PostFetchType>([
        "posts",
      ]);
      const previousPosts = previousPostsData?.data;
      if (!Array.isArray(previousPosts)) {
        return { previousData: previousPosts };
      }

      queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
        if (!Array.isArray(oldPosts?.data)) {
          return oldPosts;
        }

        return {
          ...oldPosts,
          data: oldPosts.data.map((post: PostInterface) => {
            if (post._id.toString() === postId.toString()) {
              const userId = queryClient.getQueryData<{
                data: { _id: ObjectId };
              }>(["currentUser"])?.data._id;
              const userIdString = userId?.toString();
              const isBookmarked = post.likes?.some(
                (bookmark) => bookmark.toString() === userIdString
              );

              return {
                ...post,
                bookmarks: isBookmarked
                  ? post.likes?.filter(
                      (like) => like.toString() !== userIdString
                    )
                  : [...(post.bookmarks || []), userId!],
              };
            }
            return post;
          }),
        };
      });

      return { previousData: previousPosts };
    },
  });

  const bookmarkInteraction = (
    postId: string,
    { onError }: { onError?: () => void }
  ) => {
    const previousBookmarkedState = bookmarked;
    const previousBookmarksCount = amountOfBookmarks;

    setBookmarked(!bookmarked);
    setAmountOfBookmarks((prev) => (bookmarked ? prev - 1 : prev + 1));

    bookmarkMutation.mutate(
      { postId },
      {
        onError: (error) => {
          setBookmarked(previousBookmarkedState);
          setAmountOfBookmarks(previousBookmarksCount);
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
      // Update the posts list cache
      queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
        if (!oldPosts?.data) return oldPosts;

        const postList = Array.isArray(oldPosts.data)
          ? oldPosts.data
          : [oldPosts.data];

        return {
          ...oldPosts,
          data: postList.map((post: PostInterface) => {
            if (post._id.toString() === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), newComment._id],
              };
            }
            return post;
          }),
        };
      });

      // Update the individual post cache
      queryClient.setQueryData(["post", post?.slug], (oldPost: any) => {
        if (!oldPost?.data) return oldPost;

        return {
          ...oldPost,
          data: {
            ...oldPost.data,
            comments: [...(oldPost.data.comments || []), newComment._id],
          },
        };
      });

      // Add the new full comment object to the comments cache
      queryClient.setQueryData<CommentInterface[]>(
        ["comments"],
        (oldComments) => {
          return oldComments ? [...oldComments, newComment] : [newComment];
        }
      );

      setCommentContent("");
      toast({
        title: "Success",
        description: "Your comment was successfully added.",
      });
    },
    onError: (error) => {
      const previousPosts = queryClient.getQueryData<PostFetchType>(["posts"]);
      const previousPost = queryClient.getQueryData<PostFetchType>([
        "post",
        post?.slug,
      ]);

      queryClient.setQueryData(["posts"], previousPosts);
      queryClient.setQueryData(["post", post?.slug], previousPost);

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
    onMutate: async (comment: CommentInterface) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", post?.slug] });

      const previousPostsData = queryClient.getQueryData<PostFetchType>([
        "posts",
      ]);
      const previousPostData = queryClient.getQueryData<PostFetchType>([
        "post",
        post?.slug,
      ]);

      // Optimistically update both caches...
      queryClient.setQueryData(["posts"], (oldPosts: PostFetchType) => {
        if (!oldPosts?.data) return oldPosts;

        const postList = Array.isArray(oldPosts.data)
          ? oldPosts.data
          : [oldPosts.data];

        return {
          ...oldPosts,
          data: postList.map((post: PostInterface) => {
            if (post._id.toString() === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), comment._id],
              };
            }
            return post;
          }),
        };
      });

      queryClient.setQueryData(["post", post?.slug], (oldPost: any) => {
        if (!oldPost?.data) return oldPost;

        return {
          ...oldPost,
          data: {
            ...oldPost.data,
            comments: [...(oldPost.data.comments || []), comment._id],
          },
        };
      });

      return { previousPostsData, previousPostData };
    },
  });

  const createCommentInteraction = ({ onError }: { onError?: () => void }) => {
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
          const updatedReplies = oldReplies
            ? [...oldReplies, newReply]
            : [newReply];
          return updatedReplies;
        }
      );

      // Update the grandparent's replies cache
      queryClient.setQueryData(
        [`replies-${comment?.parentId}`],
        (oldReplies: ReplyInterface[] | undefined) => {
          return oldReplies?.map((reply) => {
            if (`${reply._id}` === `${newReply.parentId}`) {
              // Remove the temporary ID and add the new reply's ID
              const filteredReplies = (reply.replies || [])
                .filter((id) => !id.startsWith("temp-"))
                .concat(`${newReply._id}`);

              return {
                ...reply,
                replies: filteredReplies,
              };
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
            console.error("No data found.");
            return oldComments;
          }

          return oldComments.map((comment) => {
            if (comment._id.toString() === newReply.parentId) {
              // Remove the temporary ID and add the new reply's ID
              const filteredReplies = (comment.replies || [])
                .filter((id) => !id.startsWith("temp-"))
                .concat(`${newReply._id}`);

              return {
                ...comment,
                replies: filteredReplies,
              };
            }
            return comment;
          });
        }
      );

      // Success Toast
      toast({
        title: "Success",
        description: "Your reply was successfully added.",
      });
    },
    onMutate: async (replyData: { parentId: string; content: string }) => {
      const tempReplyId = `temp-${Date.now()}`;

      // Cancel ongoing queries for affected caches
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      await queryClient.cancelQueries({
        queryKey: [`replies-${replyData.parentId}`],
      });
      await queryClient.cancelQueries({
        queryKey: [`replies-${comment?.parentId}`],
      });

      // Get the previous cache data for rollback
      const previousReplies = queryClient.getQueryData<ReplyInterface[]>([
        `replies-${replyData.parentId}`,
      ]);
      const previousGrandparentReplies = queryClient.getQueryData<
        ReplyInterface[]
      >([`replies-${comment?.parentId}`]);
      const previousComments = queryClient.getQueryData<CommentInterface[]>([
        "comments",
      ]);

      // Optimistic update: Add temp reply to immediate parent's replies cache
      queryClient.setQueryData(
        [`replies-${replyData.parentId}`],
        (oldReplies: ReplyInterface[] | undefined) => [
          ...(oldReplies || []),
          { ...replyData, _id: tempReplyId },
        ]
      );

      // Optimistic update: Add temp reply ID to comments cache
      queryClient.setQueryData(
        ["comments"],
        (oldComments: CommentInterface[] | undefined) => {
          if (!oldComments) return oldComments;

          return oldComments.map((comment) => {
            if (comment._id.toString() === replyData.parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), tempReplyId],
              };
            }
            return comment;
          });
        }
      );

      // Optimistic update: Add temp reply ID to grandparent's replies cache
      queryClient.setQueryData(
        [`replies-${comment?.parentId}`],
        (oldReplies: ReplyInterface[] | undefined) => {
          if (!oldReplies) return oldReplies;

          return oldReplies.map((reply) => {
            if (`${reply._id}` === `${replyData.parentId}`) {
              return {
                ...reply,
                replies: [...(reply.replies || []), tempReplyId],
              };
            }
            return reply;
          });
        }
      );

      // Return rollback data
      return {
        previousReplies,
        previousGrandparentReplies,
        previousComments,
      };
    },
    onError: (error, variables, context) => {
      if (context?.previousReplies) {
        queryClient.setQueryData(
          [`replies-${variables.parentId}`],
          context.previousReplies
        );
      }

      if (context?.previousGrandparentReplies) {
        queryClient.setQueryData(
          [`replies-${comment?.parentId}`],
          context.previousGrandparentReplies
        );
      }

      if (context?.previousComments) {
        queryClient.setQueryData(["comments"], context.previousComments);
      }

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
  };

  const likeCommentMutation = usePutRequest({
    url: `/api/comments/${id}`,
    onSuccess: (_, variables: { commentId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.commentId],
      });

      toast({
        title: "Success",
        description: "Your action was successful.",
      });
    },
    onError: (error, variables) => {
      //Error during mutation
      queryClient.invalidateQueries({ queryKey: ["comments"] });

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
    onMutate: async (newReply: any) => {
      await queryClient.cancelQueries({ queryKey: ["comments"], exact: true });
      await queryClient.cancelQueries({
        queryKey: ["comments", `${comment?._id}`],
        exact: true,
      });

      const previousCommentsData = queryClient.getQueryData<CommentFetchType>([
        "comments",
      ]);

      const previousComments = previousCommentsData?.data;
      if (!Array.isArray(previousComments)) {
        return { previousData: previousComments };
      }

      queryClient.setQueryData(
        ["comments"],
        (oldComments: CommentFetchType) => {
          if (!oldComments?.data) return oldComments;

          const commentList = Array.isArray(oldComments.data)
            ? oldComments.data
            : [oldComments.data];

          return {
            ...oldComments,
            data: commentList.map((existingComment: CommentInterface) => {
              if (existingComment.post.toString() === postId) {
                return {
                  ...existingComment,
                  replies: [...(existingComment.replies || []), newReply._id],
                };
              }
              return existingComment;
            }),
          };
        }
      );

      return { previousData: previousComments };
    },
  });

  const likeCommentInteraction = (
    commentId: string,
    { onError }: { onError?: () => void }
  ) => {
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
  };

  return {
    likeInteraction,
    likeStatus: likeMutation.status,
    liked,
    amountOfLikes,
    bookmarkInteraction,
    bookmarked,
    amountOfBookmarks,
    createCommentInteraction,
    commentContent,
    setCommentContent,
    likeCommentInteraction,
    commentLiked,
    commentLikesCount,
    handleReplyContentChange,
    createReplyInteraction,
    setReplyContent,
    replyContent,
  };
};
