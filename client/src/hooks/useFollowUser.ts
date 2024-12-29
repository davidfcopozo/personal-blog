import { useQueryClient } from "@tanstack/react-query";
import usePutRequest from "./usePutRequest";
import { UserFetchType, UserType } from "@/typings/types";
import { useToast } from "@/components/ui/use-toast";

export const useFollowUser = (user: UserType) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const currentUserData = queryClient.getQueryData<UserFetchType>([
    "currentUser",
  ]);

  const isFollowed =
    currentUserData?.data?.following?.some(
      (followingId) => followingId.toString() === user._id?.toString()
    ) ?? false;

  const toggleFollow = usePutRequest({
    url: `/api/users/${user?._id}/follow`,
    onMutate: async (userId: string) => {
      // Cancel any ongoing queries to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      await queryClient.cancelQueries({ queryKey: [`user-${user.username}`] });

      const previousCurrentUser = queryClient.getQueryData<UserFetchType>([
        "currentUser",
      ]);
      const previousTargetUser = queryClient.getQueryData<UserFetchType>([
        `user-${user.username}`,
      ]);

      const isFollowing = previousCurrentUser?.data?.following?.some(
        (id) => id.toString() === userId
      );

      if (previousCurrentUser) {
        queryClient.setQueryData(["currentUser"], {
          ...previousCurrentUser,
          data: {
            ...previousCurrentUser.data,
            following: isFollowing
              ? (previousCurrentUser.data.following || []).filter(
                  (id) => id.toString() !== userId
                )
              : [...(previousCurrentUser.data.following || []), userId],
          },
        });
      }

      if (previousTargetUser) {
        const currentUserId = previousCurrentUser?.data?._id?.toString();
        const isFollower = currentUserId
          ? previousTargetUser.data.followers?.some(
              (id) => id.toString() === currentUserId
            )
          : false;

        queryClient.setQueryData([`user-${user.username}`], {
          ...previousTargetUser,
          data: {
            ...previousTargetUser.data,
            followers: isFollower
              ? (previousTargetUser.data.followers ?? []).filter(
                  (id) => id.toString() !== currentUserId
                )
              : [...(previousTargetUser.data.followers || []), currentUserId],
          },
        });
      }

      const previousData = { previousCurrentUser, previousTargetUser };

      return { previousData };
    },
    onError: (error, _, context) => {
      // Revert optimistic updates on error
      if (context?.previousData?.previousCurrentUser) {
        queryClient.setQueryData(
          ["currentUser"],
          context.previousData?.previousCurrentUser
        );
      }
      if (context?.previousData?.previousTargetUser) {
        queryClient.setQueryData(
          [`user-${user.username}`],
          context.previousData?.previousTargetUser
        );
      }

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
      const currentUserData = queryClient.getQueryData<UserFetchType>([
        "currentUser",
      ]);

      const targetUserData = queryClient.getQueryData<UserFetchType>([
        `user-${user.username}`,
      ]);
    },
  });

  const handleFollowToggle = () => {
    toggleFollow.mutate(`${user._id}`);
  };

  return {
    handleFollowToggle,
    isPending: toggleFollow.status === "pending",
    isFollowed,
  };
};
