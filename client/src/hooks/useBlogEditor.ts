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
import { InitialPost } from "@/typings/interfaces";
import usePostRequest from "./usePostRequest";
import { useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { UserType } from "@/typings/types";

export const useBlogEditor = (initialPost: InitialPost | null = null) => {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [featureImage, setFeatureImage] = useState<string | null>(
    initialPost?.featureImage || null
  );
  const [temporaryFeatureImage, setTemporaryFeatureImage] =
    useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>(
    initialPost?.categories || []
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, data, status, error } = usePostRequest({
    url: "/api/posts",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
      setTitle("");
      setContent("");
      setFeatureImage(null);
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
      setFeatureImage(null);
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
      setFeatureImage(uploadedUrl);
      setTemporaryFeatureImage(null);
    }
  }, [temporaryFeatureImage, handleImageUpload]);

  useEffect(() => {
    if (temporaryFeatureImage) {
      handleFeatureImageUpload();
    }
  }, [temporaryFeatureImage, handleFeatureImageUpload]);

  useEffect(() => {
    if (status === "success") {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    } else if (status === "error") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post",
      });
    }
  }, [status, toast]);

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

      let currentFeatureImage = featureImage;
      if (temporaryFeatureImage) {
        currentFeatureImage = await handleImageUpload(temporaryFeatureImage);
      }

      if (initialPost) {
        // Update existing post
        console.log("Updating post:", {
          title,
          content,
          featureImage,
          categories,
          tags,
        });
      } else {
        // Create new post
        const cleanTitle = DOMPurify.sanitize(title, {
          USE_PROFILES: { html: true },
        });
        const cleanContent = DOMPurify.sanitize(content, {
          USE_PROFILES: { html: true },
        });
        mutate({
          title: cleanTitle,
          content: cleanContent,
          featureImage: currentFeatureImage,
          categories,
          tags,
        });
      }
    },
    [
      title,
      content,
      featureImage,
      categories,
      tags,
      initialPost,
      temporaryFeatureImage,
      mutate,
      handleImageUpload,
      toast,
    ]
  );
  return {
    title,
    content,
    featureImage,
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
  };
};
