import { useQueryClient, useQuery } from "@tanstack/react-query";
import usePutRequest from "./usePutRequest";
import { UserFetchType, UserType } from "@/typings/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuthModal } from "./useAuthModal";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

export const useFollowUser = (user: UserType) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = user?._id;
  const username = user?.username;

  const [localIsFollowed, setLocalIsFollowed] = useState(false);
  const isMutatingRef = useRef(false);

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

  // Subscribe to the specific user query to get real-time updates
  const { data: userProfileData } = useQuery({
    queryKey: [`user-${username}`],
    queryFn: () =>
      queryClient.getQueryData([`user-${username}`]) as
        | UserFetchType
        | undefined,
    staleTime: Infinity,
    enabled: !!username && !!queryClient.getQueryData([`user-${username}`]),
  });

  const isFollowedFromCache = useMemo(() => {
    if (!userId) return false;

    const cachedUser = userProfileData?.data;
    if (cachedUser && typeof (cachedUser as any).isFollowed === "boolean") {
      return (cachedUser as any).isFollowed;
    }

    // Check post caches for this user as author (single post or post lists)
    const postQueries = queryClient.getQueryCache().findAll({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return (
          Array.isArray(queryKey) &&
          (queryKey[0] === "post" || queryKey[0] === "posts")
        );
      },
    });

    for (const query of postQueries) {
      const postData = query.state.data as any;
      if (!postData) continue;

      if (postData.data && !Array.isArray(postData.data)) {
        const post = postData.data;
        if (
          post.postedBy?._id?.toString() === userId.toString() &&
          typeof post.postedBy.isFollowed === "boolean"
        ) {
          return post.postedBy.isFollowed;
        }
      }

      if (postData.data && Array.isArray(postData.data)) {
        for (const post of postData.data) {
          if (
            post.postedBy?._id?.toString() === userId.toString() &&
            typeof post.postedBy.isFollowed === "boolean"
          ) {
            return post.postedBy.isFollowed;
          }
        }
      }
    }

    if (!currentUserData?.data?.following) return false;

    return currentUserData.data.following.some(
      (followingId) => followingId.toString() === userId.toString()
    );
  }, [
    currentUserData?.data?.following,
    userId,
    userProfileData?.data,
    queryClient,
  ]);

  useEffect(() => {
    const handleFollowUpdate = (event: CustomEvent) => {
      const { followedUserId } = event.detail;
      if (followedUserId === userId) {
        isMutatingRef.current = false;
      }
    };

    window.addEventListener(
      "followUpdateReceived",
      handleFollowUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "followUpdateReceived",
        handleFollowUpdate as EventListener
      );
    };
  }, [userId, user?.username]);

  useEffect(() => {
    if (isMutatingRef.current) {
      return;
    }

    const prevState = localIsFollowed;
    const newState = isFollowedFromCache;

    if (prevState !== newState) {
      setLocalIsFollowed(newState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFollowedFromCache]);

  const toggleFollow = usePutRequest({
    url: `/api/users/${userId}/follow`,
    onMutate: async (variables: any) => {
      isMutatingRef.current = true;

      // Safety timeout to reset mutation flag
      setTimeout(() => {
        if (isMutatingRef.current) {
          isMutatingRef.current = false;
        }
      }, 5000);

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
      isMutatingRef.current = false;

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
    onSuccess: (data) => {
      isMutatingRef.current = false;

      // Only invalidate if we don't receive a socket event within a reasonable time
      setTimeout(() => {
        if (!isMutatingRef.current) {
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          queryClient.invalidateQueries({
            queryKey: [`user-${user.username}`],
          });
        }
        // Wait 2 seconds for socket events before forcing refetch
      }, 2000);
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
