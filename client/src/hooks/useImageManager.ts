import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useQueryClient } from "@tanstack/react-query";
import { ImageInterface } from "@/typings/interfaces";
import { UserType } from "@/typings/types";
import usePostRequest from "./usePostRequest";
import useDeleteRequest from "./useDeleteRequest";
import useFetchRequest from "./useFetchRequest";
import usePutRequest from "./usePutRequest";
import { AxiosError } from "axios";
import { getSession } from "next-auth/react";

interface ImageMetadata extends Omit<ImageInterface, "id"> {
  hash: string;
}

export const useImageManager = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  useEffect(() => {
    async function getUserId() {
      const session = await getSession();
      if (session?.user?.id) {
        setCurrentUserId(`${session.user.id}`);
      }
    }

    getUserId();
  }, []);

  const currentUser = queryClient.getQueryData<{ data: UserType }>([
    "currentUser",
  ]);

  const {
    data: userImagesData,
    isLoading: isLoadingImages,
    refetch: refetchImages,
  } = useFetchRequest(
    ["user-images"],
    `/api/users/${currentUser?.data._id}/images`
  );

  const { mutate: storeImageMetadata } = usePostRequest({
    url: `/api/users/${currentUserId}/images`,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-images"] });
      toast({
        title: "Success",
        description: "Image metadata stored successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to store image metadata: ${error.message}`,
      });
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user-images"] });
      const previousData = queryClient.getQueryData(["user-images"]);
      return { previousData };
    },
  });

  const { mutate: deleteImageMetadata } = useDeleteRequest({
    url: `/api/users/${currentUserId}/images`,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-images"] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete image: ${error?.message}`,
      });
    },
  });

  const { mutate: updateImageMutation } = usePutRequest({
    url: `/api/users/${currentUserId}/images`,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-images"] });
      toast({
        title: "Success",
        description: "Image metadata updated successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update image: ${error.message}`,
      });
    },
  });

  const updateImageMetadata = useCallback(
    async (imageId: string, updates: Partial<ImageInterface>) => {
      try {
        await updateImageMutation({
          url: `/api/images/${imageId}`,
          data: updates,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast({
          variant: "destructive",
          title: "Error updating image",
          description: `Failed to update image: ${errorMessage}`,
        });
        throw error;
      }
    },
    [updateImageMutation, toast]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      setUploading(true);
      const currentUser = queryClient.getQueryData<{ data: UserType }>([
        "currentUser",
      ]);

      if (!currentUser) {
        setUploading(false);
        throw new Error("User not authenticated");
      }

      const currentUserId = `${currentUser.data._id}`;
      let downloadURL = "";

      try {
        // Generate a unique filename
        const id = `${file.name.split(".")[0]}-${Date.now()}`;
        const idWithoutSpaces = id.replace(/\\s+/g, "-");
        const fileName = encodeURIComponent(idWithoutSpaces);

        const storageRef = ref(storage, `images/${currentUserId}/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref);

        const dimensions = await getImageDimensions(file);

        const hash = btoa(downloadURL).slice(0, 10);

        const imageMetadata: ImageMetadata = {
          url: downloadURL,
          name: file.name,
          size: file.size,
          type: file.type,
          dimensions: `${dimensions.width}x${dimensions.height}`,
          createdAt: new Date(),
          title: file.name.split(".")[0],
          altText: "",
          tags: [],
          hash,
        };

        await storeImageMetadata({ images: imageMetadata });

        setUploading(false);
        return downloadURL;
      } catch (error) {
        setUploading(false);
        // If metadata storage fails but Firebase upload succeeded, clean up the uploaded file
        if (downloadURL) {
          try {
            const imageUrl = downloadURL;
            const imagePath = imageUrl
              .split(`${currentUserId}%2F`)[1]
              ?.split("?")[0];

            if (imagePath) {
              const imageRef = ref(
                storage,
                `images/${currentUserId}/${imagePath}`
              );
              await deleteObject(imageRef);
            }
          } catch (cleanupError) {
            console.error(
              "Failed to clean up orphaned Firebase image:",
              cleanupError
            );
          }
        }

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast({
          variant: "destructive",
          title: "Error uploading image",
          description: `Failed to upload image: ${errorMessage}`,
        });
        throw error;
      }
    },
    [queryClient, toast, storeImageMetadata]
  );

  const deleteImage = useCallback(
    async (imageId: string) => {
      setDeleting(true);
      const currentUser = queryClient.getQueryData<{ data: UserType }>([
        "currentUser",
      ]);
      if (!currentUser) {
        setDeleting(false);
        throw new Error("User not authenticated");
      }

      try {
        // Find image in stored images
        const images = userImagesData?.data || [];
        const imageToDelete = images.find(
          (img: ImageInterface) => img.id === imageId
        );

        if (!imageToDelete) {
          setDeleting(false);
          throw new Error("Image not found");
        }

        const currentUserId = `${currentUser.data._id}`;
        const imageUrl = imageToDelete.url;
        const imagePath = imageUrl
          .split(`${currentUserId}%2F`)[1]
          ?.split("?")[0];

        if (imagePath) {
          const imageRef = ref(storage, `images/${currentUserId}/${imagePath}`);
          await deleteObject(imageRef);
        }

        deleteImageMetadata({ itemId: imageId, key: "image" });

        setDeleting(false);
        return true;
      } catch (error) {
        setDeleting(false);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast({
          variant: "destructive",
          title: "Error deleting image",
          description: `Failed to delete image: ${errorMessage}`,
        });
        throw error;
      }
    },
    [queryClient, toast, deleteImageMetadata, userImagesData]
  );

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src); // Clean up
      };
      img.src = URL.createObjectURL(file);
    });
  };

  return {
    uploadImage,
    deleteImage,
    updateImageMetadata,
    userImages: userImagesData?.data || [],
    isLoadingImages,
    uploading,
    deleting,
    refetchImages,
  };
};
