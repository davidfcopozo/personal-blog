import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import usePatchRequest from "./usePatchRequest";
import { UserType } from "@/typings/types";
import { clearCache } from "@/utils/request-cache";

export const useAvatarUpdate = (userId?: string, onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: updateAvatar,
    status,
    error,
  } = usePatchRequest({
    url: `/api/users/${userId}`,
    onSuccess: (updatedUser: UserType) => {
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll({
        predicate: (query) => {
          return (
            Array.isArray(query.queryKey) && query.queryKey[0] === "currentUser"
          );
        },
      });

      queries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldData: any) => {
          if (!oldData || !oldData.data) {
            return oldData;
          }

          const newData = {
            ...oldData,
            data: {
              ...oldData.data,
              avatar: updatedUser.avatar,
            },
          };
          return newData;
        });
      });

      if (userId) {
        clearCache(`current-user-${userId}`);
      }

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update profile picture: ${error.message}`,
      });
    },
    onMutate: async (newData: { avatar: string | null }) => {
      await queryClient.cancelQueries({
        predicate: (query) => {
          return (
            Array.isArray(query.queryKey) && query.queryKey[0] === "currentUser"
          );
        },
      });

      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll({
        predicate: (query) => {
          return (
            Array.isArray(query.queryKey) && query.queryKey[0] === "currentUser"
          );
        },
      });

      queries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldData: any) => {
          // Skip null data queries or queries without proper structure
          if (!oldData || !oldData.data) {
            return oldData;
          }

          const newQueryData = {
            ...oldData,
            data: {
              ...oldData.data,
              avatar: newData.avatar,
            },
          };
          return newQueryData;
        });
      });

      return { previousData: undefined };
    },
  });

  const changeAvatar = (imageUrl: string) => {
    updateAvatar({ avatar: imageUrl });
  };

  const deleteAvatar = () => {
    updateAvatar({ avatar: null });
  };

  return {
    changeAvatar,
    deleteAvatar,
    isUpdating: status === "pending",
    error,
  };
};
