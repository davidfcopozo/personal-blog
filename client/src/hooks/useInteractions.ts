import { useQueryClient } from "@tanstack/react-query";
import usePutRequest from "./usePutRequest";
import { useToast } from "@/components/ui/use-toast";
import { PostFetchType } from "@/typings/types";
import { ObjectId } from "mongoose";
import { PostInterface } from "../../../api/src/typings/models/post";

export const useInteractions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const likeInteraction = (
    postId: string,
    { onError }: { onError?: () => void }
  ) => {
    likeMutation.mutate(
      { postId },
      {
        onError: (error) => {
          if (onError) onError();
          //Error after likeMutation's internal error
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

  const bookmarkInteraction = (
    postId: string,
    { onError }: { onError?: () => void }
  ) => {
    bookmarkMutation.mutate(
      { postId },
      {
        onError: (error) => {
          if (onError) onError();
          //Error after likeMutation's internal error
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

  return {
    likeInteraction,
    likeStatus: likeMutation.status,
    bookmarkInteraction,
  };
};
