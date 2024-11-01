import {
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { InitialPost, UseBlogEditorProps } from "@/typings/interfaces";
import usePostRequest from "./usePostRequest";
import { useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { UpdatePostPayload, UserType } from "@/typings/types";
import mongoose, { ObjectId } from "mongoose";
import useUpdateRequest from "./useUpdateRequest";

export const useBlogEditor = ({ initialPost, slug }: UseBlogEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [temporaryFeatureImage, setTemporaryFeatureImage] =
    useState<File | null>(null);
  const [categories, setCategories] = useState<ObjectId[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: newPostMutate,
    data: newPostData,
    status: newPostStatus,
    error: newPostError,
  } = usePostRequest({
    url: "/api/posts",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
      setTitle("");
      setContent("");
      setFeaturedImage(null);
      setCategories([]);
      setTags([]);
      setTemporaryFeatureImage(null);
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
  } = useUpdateRequest({
    url: `/api/posts/${initialPost?._id}`,
    onSuccess: (updatePostData, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
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

  const deleteImageFromFirebase = useCallback(async (imageUrl: string) => {
    const currentUser = await queryClient.getQueryData<{ data: UserType }>([
      "currentUser",
    ]);
    if (!currentUser) {
      throw new Error("Current user data not found");
    }
    let currentUserId: string = `${currentUser.data._id}`;
    try {
      const imagePath = imageUrl.split(`${currentUserId}%2F`)[1]?.split("?")[0];
      if (imagePath) {
        const imageRef = ref(storage, `images/${currentUserId}/${imagePath}`);
        await deleteObject(imageRef);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const extractImagesFromContent = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));

    return images.map((img) => img.src);
  };

  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value);
      const contentImages = extractImagesFromContent(value);

      const firebaseImages = contentImages.filter((url) =>
        url.includes("firebasestorage.googleapis.com")
      );

      const removedImages = currentImages.filter(
        (img) =>
          !firebaseImages.includes(img) &&
          img.includes("firebasestorage.googleapis.com")
      );

      if (removedImages.length > 0) {
        removedImages.forEach(deleteImageFromFirebase);
        setCurrentImages(contentImages);
      }
    },
    [currentImages, setCurrentImages]
  );

  const handleFeatureImagePick = useCallback((file: File | null) => {
    if (file) {
      setTemporaryFeatureImage(file);
    } else {
      setTemporaryFeatureImage(null);
      setFeaturedImage(null);
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    const currentUser = await queryClient.getQueryData<{ data: UserType }>([
      "currentUser",
    ]);

    let currentUserId = await `${currentUser?.data._id}`;
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
  }, []);

  const handleFeatureImageUpload = useCallback(async () => {
    if (temporaryFeatureImage) {
      const uploadedUrl = await handleImageUpload(temporaryFeatureImage);
      setFeaturedImage(uploadedUrl);
      setTemporaryFeatureImage(null);
    }
  }, [temporaryFeatureImage, handleImageUpload]);

  useEffect(() => {
    if (temporaryFeatureImage) {
      handleFeatureImageUpload();
    }
  }, [temporaryFeatureImage, handleFeatureImageUpload]);

  useEffect(() => {
    if (newPostStatus === "success") {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    } else if (newPostStatus === "error") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post",
      });
    }
  }, [newPostStatus, toast]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
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
        console.log("Updating post");
        const cleanTitle = DOMPurify.sanitize(title, {
          USE_PROFILES: { html: true },
        });
        const cleanContent = DOMPurify.sanitize(content, {
          USE_PROFILES: { html: true },
        });

        const changes: UpdatePostPayload = {};

        // Only add properties that have changed
        if (cleanTitle !== initialPost.title) {
          changes.title = cleanTitle;
        }

        if (cleanContent !== initialPost.content) {
          changes.content = cleanContent;
        }

        if (currentFeatureImage !== initialPost.featuredImage) {
          changes.featuredImage = currentFeatureImage || undefined;
        }

        // Compare arrays using for deep equality
        if (
          JSON.stringify(categories) !== JSON.stringify(initialPost.categories)
        ) {
          changes.categories = categories;
        }

        if (JSON.stringify(tags) !== JSON.stringify(initialPost.tags)) {
          changes.tags = tags;
        }

        // Only make the update request if there are changes
        if (Object.keys(changes).length > 0) {
          updatePostMutate({
            ...changes,
            _id: initialPost._id as unknown as mongoose.Types.ObjectId,
          });
          console.log("Changes===>", { ...changes, _id: initialPost._id });
        } else {
          toast({
            title: "No Changes",
            description: "No changes were made to the post.",
          });
        }
      } else {
        console.log("Creating post");
        const cleanTitle = DOMPurify.sanitize(title, {
          USE_PROFILES: { html: true },
        });
        const cleanContent = DOMPurify.sanitize(content, {
          USE_PROFILES: { html: true },
        });
        newPostMutate({
          title: cleanTitle,
          content: cleanContent,
          featuredImage: currentFeatureImage,
          categories,
          tags,
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
    ]
  );
  return {
    title,
    content,
    featuredImage,
    temporaryFeatureImage,
    tags,
    categories,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleImageUpload,
    handleFeatureImagePick,
    setTags,
    setCategories,
    setTitle,
    setContent,
    setFeaturedImage,
  };
};
