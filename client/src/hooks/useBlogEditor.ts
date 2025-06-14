import { useState, useCallback, ChangeEvent, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  CategoryInterface,
  InitialPost,
  UseBlogEditorProps,
} from "@/typings/interfaces";
import usePostRequest from "./usePostRequest";
import { useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { UpdatePostPayload, UserType } from "@/typings/types";
import usePatchRequest from "./usePatchRequest";
import { arraysEqual } from "@/utils/formats";

export const useBlogEditor = ({ initialPost, slug }: UseBlogEditorProps) => {
  const [temporaryFeatureImage, setTemporaryFeatureImage] =
    useState<File | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    featuredImage: null as string | null,
    categories: [] as CategoryInterface[],
    tags: [] as string[],
  });

  const { title, content, featuredImage, categories, tags } = postData;

  const updatePostState = useCallback(
    <T extends keyof typeof postData>(key: T, value: (typeof postData)[T]) => {
      setPostData((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    },
    []
  );
  const {
    mutate: newPostMutate,
    data: newPostData,
    status: newPostStatus,
    error: newPostError,
  } = usePostRequest({
    url: "/api/posts",
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });

      // Redirect to edit page instead of resetting state
      if (data?.slug) {
        toast({
          title: "Success",
          description:
            "Blog post created successfully! Redirecting to edit page...",
        });
        // Add a small delay to ensure the toast is shown before redirect
        setTimeout(() => {
          router.push(`/edit-post/${data.slug}`);
        }, 100);
      } else {
        toast({
          title: "Success",
          description:
            "Blog post created successfully, but couldn't redirect to edit page",
        });
      }
    },
    onError: () => {
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], previousPosts);
    },
    onMutate: async (post: InitialPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"], exact: true });
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(
        ["posts"],
        (oldData: InitialPost[] | undefined) => [
          ...(oldData || []),
          {
            ...post,
          },
        ]
      );
      return { previousPosts };
    },
  });
  const {
    mutate: updatePostMutate,
    data: updatePostData,
    status: updatePostStatus,
    error: updatePostError,
  } = usePatchRequest({
    url: `/api/posts/${initialPost?._id}`,
    onSuccess: (updatePostData, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      // For updates, we're already on the edit page, so no need to redirect
      // Just invalidate queries to refresh the data
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["posts"], context.previousData);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog post: " + error.message,
      });
    },
    onMutate: async (newPost: UpdatePostPayload) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueryData<UpdatePostPayload[]>([
        "posts",
      ]);

      if (previousData) {
        queryClient.setQueryData<UpdatePostPayload>(
          ["posts", newPost?._id],
          (old) => ({
            ...old,
            ...newPost,
          })
        );
      }

      return { previousData };
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteImageFromFirebase = useCallback(
    async (imageUrl: string) => {
      const currentUser = await queryClient.getQueryData<{ data: UserType }>([
        "currentUser",
      ]);
      if (!currentUser) {
        throw new Error("Current user data not found");
      }
      let currentUserId: string = `${currentUser.data._id}`;
      try {
        const imagePath = imageUrl
          .split(`${currentUserId}%2F`)[1]
          ?.split("?")[0];
        if (imagePath) {
          const imageRef = ref(storage, `images/${currentUserId}/${imagePath}`);
          await deleteObject(imageRef);
        }
      } catch (error) {
        throw error;
      }
    },
    [queryClient]
  );

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updatePostState("title", e.target.value);
    },
    [updatePostState]
  );

  const extractImagesFromContent = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));

    return images.map((img) => img.src);
  };

  const handleContentChange = useCallback(
    (value: string) => {
      updatePostState("content", value);
    },
    [updatePostState]
  );

  const handleFeatureImagePick = useCallback(
    (fileOrUrl: File | { url: string; isDirectUrl: boolean } | null) => {
      if (!fileOrUrl) {
        setTemporaryFeatureImage(null);
        updatePostState("featuredImage", null);
        return;
      }

      // Handle direct URL from gallery selection
      if ("isDirectUrl" in fileOrUrl && fileOrUrl.isDirectUrl) {
        updatePostState("featuredImage", fileOrUrl.url);
        setTemporaryFeatureImage(null);
        return;
      }

      setTemporaryFeatureImage(fileOrUrl as File);
    },
    [updatePostState]
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      const currentUser = queryClient.getQueryData<{ data: UserType }>([
        "currentUser",
      ]);

      let currentUserId = `${currentUser?.data._id}`;
      try {
        const id = `${file.name.split(".")[0]}-${Date.now()}`;
        let idWithoutSpaces = id.replace(/\s+/g, "-");
        const fileName = encodeURIComponent(idWithoutSpaces);
        const storageRef = ref(storage, `images/${currentUserId}/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const newImages = [...currentImages, downloadURL];
        setCurrentImages(newImages);
        return downloadURL;
      } catch (error: Error | any) {
        toast({
          variant: "destructive",
          title: "Error uploading image",
          description: `Failed to upload image: ${error?.message}`,
        });
        throw error;
      }
    },
    [currentImages, queryClient, toast]
  );

  const handleFeatureImageUpload = useCallback(async () => {
    if (temporaryFeatureImage) {
      const uploadedUrl = await handleImageUpload(temporaryFeatureImage);
      updatePostState("featuredImage", uploadedUrl);
      setTemporaryFeatureImage(null);
    }
  }, [temporaryFeatureImage, handleImageUpload, updatePostState]);
  useEffect(() => {
    if (temporaryFeatureImage) {
      handleFeatureImageUpload();
    }
  }, [temporaryFeatureImage, handleFeatureImageUpload]);

  // Only show error toast for newPost, success is handled in onSuccess callback
  useEffect(() => {
    if (newPostStatus === "error") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post",
      });
    }
  }, [newPostStatus, toast]);
  const handleSubmit = useCallback(
    async (status: "draft" | "published" | "unpublished") => {
      if (!title) {
        return toast({
          variant: "destructive",
          title: "Blog Post Failed",
          description: "Please enter a title for the blog post.",
        });
      }

      if (!content || content === "<p><br></p>") {
        return toast({
          variant: "destructive",
          title: "Blog Post Failed",
          description: "Please enter content for the blog post.",
        });
      }

      let currentFeatureImage = featuredImage;
      if (temporaryFeatureImage) {
        currentFeatureImage = await handleImageUpload(temporaryFeatureImage);
      }
      if (initialPost && slug) {
        const cleanTitle = DOMPurify.sanitize(title, {
          ALLOWED_TAGS: ["p", "br", "span", "strong", "em", "b", "i"],
          ALLOWED_ATTR: [],
        });
        // Don't sanitize content on client - let server handle it
        const cleanContent = content;

        const changes: UpdatePostPayload = {};

        // Add changed properties to changes object only if they differ
        if (cleanTitle !== initialPost.title) {
          changes.title = cleanTitle;
        }
        if (cleanContent !== initialPost.content) {
          changes.content = cleanContent;
        }
        if (currentFeatureImage !== initialPost.featuredImage) {
          changes.featuredImage = currentFeatureImage as string;
        }

        // Always include status when explicitly provided (user clicked draft/publish)
        changes.status = status;

        // Compare categories and tags for genuine differences
        if (
          categories.length > 0 ||
          (initialPost.categories && initialPost.categories.length > 0)
        ) {
          if (!arraysEqual(categories, initialPost.categories || [])) {
            changes.categories = categories;
          }
        }

        if (tags.length > 0 || (initialPost.tags ?? []).length > 0) {
          if (!arraysEqual(tags, initialPost.tags || [])) {
            changes.tags = tags;
          }        } // Only proceed with mutation if there are changes to be made
        if (Object.keys(changes).length > 0) {
          console.log("Sending update with changes:", changes);
          updatePostMutate({
            ...changes,
            _id: initialPost?._id?.toString(),
          });
        } else {
          // If no content changes but status is different, still allow the update
          if (status !== initialPost.status) {
            updatePostMutate({
              status,
              _id: initialPost?._id?.toString(),
            });
          } else {
            toast({
              title: "No Changes",
              description: "No changes were made to the post.",
            });
          }
        }
      } else {
        const cleanTitle = DOMPurify.sanitize(title, {
          ALLOWED_TAGS: ["p", "br", "span", "strong", "em", "b", "i"],
          ALLOWED_ATTR: [],
        });
        // Don't sanitize content on client - let server handle it
        const cleanContent = content;
        newPostMutate({
          title: cleanTitle,
          content: cleanContent,
          featuredImage: currentFeatureImage,
          categories,
          tags,
          status, // Include status in new post creation
        });
      }
    },
    [
      title,
      content,
      featuredImage,
      categories,
      tags,
      initialPost,
      temporaryFeatureImage,
      newPostMutate,
      handleImageUpload,
      toast,
      slug,
      updatePostMutate,
    ]
  );

  // Check if there are any unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (!initialPost) {
      // For new posts, check if there's any content
      return !!(
        title ||
        (content && content !== "<p><br></p>") ||
        featuredImage ||
        categories.length > 0 ||
        tags.length > 0
      );
    }

    // For existing posts, compare with initial values
    const cleanTitle = DOMPurify.sanitize(title, {
      ALLOWED_TAGS: ["p", "br", "span", "strong", "em", "b", "i"],
      ALLOWED_ATTR: [],
    });

    return (
      cleanTitle !== initialPost.title ||
      content !== initialPost.content ||
      featuredImage !== initialPost.featuredImage ||
      !arraysEqual(categories, initialPost.categories || []) ||
      !arraysEqual(tags, initialPost.tags || [])
    );
  }, [title, content, featuredImage, categories, tags, initialPost]);

  return {
    temporaryFeatureImage,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleImageUpload,
    handleFeatureImagePick,
    updatePostState,
    postData,
    hasUnsavedChanges,
  };
};
