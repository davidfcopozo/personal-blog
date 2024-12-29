import { useQueryClient } from "@tanstack/react-query";
import usePutRequest from "./usePutRequest";
import { UserFetchType, UserType } from "@/typings/types";
import { useToast } from "@/components/ui/use-toast";

export const useFollowUser = (user: UserType) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleFollow = usePutRequest({
    url: `/api/users/${user?._id}/follow`,
    onSuccess: (_, userId: string) => {
      const currentUserData = queryClient.getQueryData<UserFetchType>([
        "currentUser",
      ]);

      if (currentUserData?.data) {
        const isFollowing = currentUserData.data.following?.some(
          (id) => id.toString() === userId
        );
        const updatedCurrentUser = {
          ...currentUserData,
          data: {
            ...currentUserData.data,
            following: isFollowing
              ? (currentUserData.data.following || []).filter(
                  (id) => id.toString() !== userId
                )
              : [...(currentUserData.data.following || []), userId],
          },
        };
        queryClient.setQueryData(["currentUser"], updatedCurrentUser);
      }

      const targetUserData = queryClient.getQueryData<UserFetchType>([
        `user-${user.username}`,
      ]);

      if (targetUserData?.data) {
        const currentUserId = currentUserData?.data._id?.toString();
        const isFollower =
          currentUserId &&
          targetUserData.data.followers?.some(
            (id) => id.toString() === currentUserId
          );
        const updatedTargetUser = {
          ...targetUserData,
          data: {
            ...targetUserData.data,
            followers: isFollower
              ? (targetUserData.data.followers ?? []).filter(
                  (id) => id.toString() !== currentUserId
                )
              : [...(targetUserData.data.followers ?? []), currentUserId],
          },
        };
        queryClient.setQueryData([`user-${user.username}`], updatedTargetUser);
      }

      toast({
        title: "Success",
        description: "Follow status updated successfully.",
      });
    },
    onError: (error, userId: string, context) => {
      // Revert changes using the context from onMutate
      if (context?.previousData) {
        queryClient.setQueryData(
          ["currentUser"],
          context.previousData.currentUser
        );
        queryClient.setQueryData(
          [`user-${user.username}`],
          context.previousData.targetUser
        );
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update follow status. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    },
    onMutate: async (userId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["currentUser"],
        exact: true,
      });
      await queryClient.cancelQueries({
        queryKey: [`user-${user.username}`],
        exact: true,
      });

      const previousCurrentUser = queryClient.getQueryData<UserFetchType>([
        "currentUser",
      ]);
      const previousTargetUser = queryClient.getQueryData<UserFetchType>([
        `user-${user.username}`,
      ]);

      const previousData = {
        currentUser: previousCurrentUser,
        targetUser: previousTargetUser,
      };

      const currentUserData = queryClient.getQueryData<UserFetchType>([
        "currentUser",
      ]);

      if (currentUserData?.data) {
        const isFollowing = currentUserData.data.following?.some(
          (id) => id.toString() === userId
        );
        queryClient.setQueryData(["currentUser"], {
          ...currentUserData,
          data: {
            ...currentUserData.data,
            following: isFollowing
              ? (currentUserData.data.following ?? []).filter(
                  (id) => id.toString() !== userId
                )
              : [...(currentUserData.data.following || []), userId],
          },
        });
      }

      const targetUserData = queryClient.getQueryData<UserFetchType>([
        `user-${user.username}`,
      ]);

      if (targetUserData?.data) {
        const currentUserId = currentUserData?.data._id?.toString();
        const isFollower =
          currentUserId &&
          targetUserData.data.followers?.some(
            (id) => id.toString() === currentUserId
          );
        queryClient.setQueryData([`user-${user.username}`], {
          ...targetUserData,
          data: {
            ...targetUserData.data,
            followers: isFollower
              ? (targetUserData.data.followers ?? []).filter(
                  (id) => id.toString() !== currentUserId
                )
              : [...(targetUserData.data.followers ?? []), currentUserId],
          },
        });
      }

      return {
        previousData: previousData,
        newData: undefined,
      };
    },
  });

  const handleFollowToggle = () => {
    toggleFollow.mutate(`${user._id}`);
  };

  return { handleFollowToggle, isPending: toggleFollow.status === "pending" };
};
