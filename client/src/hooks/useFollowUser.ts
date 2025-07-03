import { useQueryClient, useQuery } from "@tanstack/react-query";
import usePutRequest from "./usePutRequest";
import { UserFetchType, UserType } from "@/typings/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuthModal } from "./useAuthModal";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useFollowUser = (user: UserType) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = user?._id;

  const [localIsFollowed, setLocalIsFollowed] = useState(false);

  const {
    requireAuth,
    isOpen: isAuthModalOpen,
    currentAction,
    closeModal,
    handleSuccess,
  } = useAuthModal();

  const { data: currentUserData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () =>
      queryClient.getQueryData(["currentUser"]) as UserFetchType | undefined,
    // This prevents an actual fetch, we just want to subscribe to cache changes
    staleTime: Infinity,
    enabled: !!queryClient.getQueryData(["currentUser"]),
  });

  const isFollowedFromCache = useMemo(() => {
    if (!userId || !currentUserData?.data?.following) return false;

    return currentUserData.data.following.some(
      (followingId) => followingId.toString() === userId.toString()
    );
  }, [currentUserData?.data?.following, userId]);

  useEffect(() => {
    setLocalIsFollowed(isFollowedFromCache);
  }, [isFollowedFromCache]);

  const toggleFollow = usePutRequest({
    url: `/api/users/${userId}/follow`,
    onMutate: async (variables: any) => {
      // Cancel any ongoing queries to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      await queryClient.cancelQueries({ queryKey: [`user-${user.username}`] });

      // Store previous data for rollback
      const previousData: any = {
        currentUser: queryClient.getQueryData<UserFetchType>(["currentUser"]),
        targetUser: queryClient.getQueryData<UserFetchType>([
          `user-${user.username}`,
        ]),
      };

      setLocalIsFollowed(!localIsFollowed);

      const isCurrentlyFollowing =
        previousData.currentUser?.data?.following?.some(
          (id: string) => id.toString() === userId?.toString()
        );

      // Optimistic update for current user
      if (previousData.currentUser && userId) {
        const updatedFollowing = isCurrentlyFollowing
          ? (previousData.currentUser.data.following || []).filter(
              (id: string) => id.toString() !== userId.toString()
            )
          : [...(previousData.currentUser.data.following || []), userId];

        queryClient.setQueryData(["currentUser"], {
          ...previousData.currentUser,
          data: {
            ...previousData.currentUser.data,
            following: updatedFollowing,
          },
        });
      }

      // Optimistic update for target user
      if (previousData.targetUser && userId) {
        const currentUserId = previousData.currentUser?.data?._id?.toString();
        const isFollower = currentUserId
          ? previousData.targetUser.data.followers?.some(
              (id: string) => id.toString() === currentUserId
            )
          : false;

        const updatedFollowers = isFollower
          ? (previousData.targetUser.data.followers ?? []).filter(
              (id: string) => id.toString() !== currentUserId
            )
          : [...(previousData.targetUser.data.followers || []), currentUserId];

        queryClient.setQueryData([`user-${user.username}`], {
          ...previousData.targetUser,
          data: {
            ...previousData.targetUser.data,
            followers: updatedFollowers,
            isFollowed: !isFollower,
          },
        });
      }

      const postQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) &&
            (queryKey[0] === "post" || queryKey[0] === "posts")
          );
        },
      });

      postQueries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldData: any) => {
          if (!oldData?.data) return oldData;

          const updatePostData = (post: any) => {
            if (post?.postedBy?._id?.toString() === userId?.toString()) {
              const currentUserId =
                previousData.currentUser?.data?._id?.toString();
              const followers = post.postedBy.followers || [];
              const isFollower = followers.includes(currentUserId);

              return {
                ...post,
                postedBy: {
                  ...post.postedBy,
                  followers: isFollower
                    ? followers.filter((id: string) => id !== currentUserId)
                    : [...followers, currentUserId],
                  isFollowed: !isFollower,
                },
              };
            }
            return post;
          };

          if (!Array.isArray(oldData.data)) {
            return {
              ...oldData,
              data: updatePostData(oldData.data),
            };
          }

          return {
            ...oldData,
            data: oldData.data.map((post: any) => updatePostData(post)),
          };
        });
      });

      return previousData;
    },
    onError: (error, _, context: any) => {
      // Revert optimistic updates on error
      if (context?.currentUser) {
        queryClient.setQueryData(["currentUser"], context.currentUser);
      }
      if (context?.targetUser) {
        queryClient.setQueryData([`user-${user.username}`], context.targetUser);
      }

      setLocalIsFollowed(isFollowedFromCache);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update follow status. Please try again.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: [`user-${user.username}`] });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  const handleFollowToggle = useCallback(() => {
    requireAuth("follow", () => {
      toggleFollow.mutate({});
    });
  }, [requireAuth, toggleFollow]);

  return {
    handleFollowToggle,
    isPending: toggleFollow.status === "pending",
    isFollowed: localIsFollowed,
    // Auth modal properties
    isAuthModalOpen,
    authModalAction: currentAction,
    closeAuthModal: closeModal,
    handleAuthSuccess: handleSuccess,
  };
};
