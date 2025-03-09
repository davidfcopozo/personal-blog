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
import useDeleteImages from "./useDeleteImages";
import useFetchRequest from "./useFetchRequest";
import usePutRequest from "./usePutRequest";
import { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import getImageHash from "@/utils/getImageHash";

interface ImageMetadata extends Omit<ImageInterface, "_id"> {
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
        description: "Image uploaded successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to upload image: ${error.message}`,
      });
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user-images"] });
      const previousData = queryClient.getQueryData(["user-images"]);
      return { previousData };
    },
  });

  const { mutate: deleteImageMetadata, error: deleteImageError } =
    useDeleteImages({
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
        description: "Image updated successfully",
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
      // Stop if already uploading
      if (uploading) {
        toast({
          title: "Upload in progress",
          description: "Please wait for the current upload to finish.",
        });
        throw new Error("Upload in progress");
      }

      setUploading(true);
      const currentUser = queryClient.getQueryData<{ data: UserType }>([
        "currentUser",
      ]);

      if (!currentUser) {
        setUploading(false);
        throw new Error("User not authenticated");
      }

      const currentUserId = `${currentUser.data._id}`;

      if (!currentUserId) {
        setUploading(false);
        throw new Error("User not authenticated");
      }
      let downloadURL = "";

      try {
        const hash = await getImageHash(file);

        // Check if there's a matching ongoing or completed upload
        const uploadingOrExists = userImagesData?.data.some(
          (img: ImageInterface) => img.hash === hash
        );
        if (uploadingOrExists) {
          setUploading(false);
          toast({
            title: "Duplicate or existing upload",
            description: "This image is already being uploaded or exists.",
          });
          throw new Error("Duplicate or existing upload");
        }

        const existingImages = userImagesData?.data || [];
        const duplicateImage = existingImages.find(
          (image: ImageInterface) => image.hash === hash
        );

        if (duplicateImage) {
          setUploading(false);
          toast({
            title: "Duplicate image",
            description: `An image with the same content already exists: ${duplicateImage.name}`,
          });
          return duplicateImage.url; // Return the URL of the existing image
        }

        // Generate a unique filename
        const id = `${file.name.split(".")[0]}-${Date.now()}`;
        const idWithoutSpaces = id.replace(/\\s+/g, "-");
        const fileName = encodeURIComponent(idWithoutSpaces);

        const storageRef = ref(storage, `images/${currentUserId}/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref);

        const dimensions = await getImageDimensions(file);

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

        storeImageMetadata({ images: imageMetadata });

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

        const isDuplicateError =
          typeof errorMessage === "string" &&
          (errorMessage.toLowerCase().includes("duplicate") ||
            errorMessage.toLowerCase().includes("duplicated"));

        toast({
          title: isDuplicateError ? "Duplicate image" : "Error uploading image",
          description: `${errorMessage}`,
        });

        throw error;
      }
    },
    [queryClient, toast, storeImageMetadata, userImagesData, uploading]
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

      // Find image in stored images
      const images = userImagesData?.data || [];

      const imageToDelete = images.find(
        (img: ImageInterface) => img._id?.toString() === imageId
      );

      try {
        if (!imageToDelete) {
          setDeleting(false);
          throw new Error("Image not found");
        }

        deleteImageMetadata({ itemId: imageId });

        if (deleteImageError) {
          setDeleting(false);
          throw new Error("Failed to delete image");
        }

        // Only proceed with Firebase deletion if MongoDB deletion succeeded
        const imageUrl = imageToDelete.url;
        const pathPart = imageUrl.split("/o/")[1];

        if (pathPart) {
          const encodedPath = pathPart.split("?")[0];
          const decodedPath = decodeURIComponent(encodedPath);
          console.log(`Attempting to delete from Firebase: ${decodedPath}`);

          const imageRef = ref(storage, decodedPath);
          await deleteObject(imageRef);
        } else {
          console.warn("Could not parse image path from URL:", imageUrl);
        }
      } catch (firebaseError: any) {
        if (firebaseError.code === "storage/object-not-found") {
          console.warn("Firebase object not found:", firebaseError);
        } else {
          console.error("Firebase image deletion failed:", firebaseError);
        }
      }
    },
    [queryClient, deleteImageMetadata, userImagesData, deleteImageError]
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
