import { useState, useCallback, ChangeEvent, FormEvent } from "react";
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
import { useAuth } from "@/context/AuthContext";

export const useBlogEditor = (initialPost: InitialPost | null = null) => {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [featureImage, setFeatureImage] = useState<string | null>(
    initialPost?.featureImage || null
  );
  const [categories, setCategories] = useState<string[]>(
    initialPost?.categories || []
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const queryClient = useQueryClient();

  const { mutate, data, status, error } = usePostRequest({
    url: "/api/posts",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
    },
    onError: () => {
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], previousPosts);
    },
    onMutate: async (post: InitialPost) => {
      await queryClient.cancelQueries({
        queryKey: ["posts"],
        exact: true,
      });

      queryClient.setQueryData(["posts"], (oldData: InitialPost[]) => [
        {
          ...oldData,
          id: `${post.createdBy}`,
          title: post.title,
          content: post.content,
          featureImage: post.featureImage,
          categories: [post.categories],
          tags: [post.tags],
        },
      ]);
    },
  });

  const deleteImageFromFirebase = useCallback(async (imageUrl: string) => {
    try {
      const imagePath = imageUrl.split("images%2F")[1]?.split("?")[0];
      if (imagePath) {
        const imageRef = ref(storage, `images/${imagePath}`);
        await deleteObject(imageRef);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

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

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const id = `${file.name.split(".")[0]}-${Date.now()}`;
      let idWithoutSpaces = id.replace(/\s+/g, "-");
      const fileName = encodeURIComponent(idWithoutSpaces);
      const storageRef = ref(storage, `images/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const newImages = [...currentImages, downloadURL];
      setCurrentImages(newImages);
      return downloadURL;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  }, []);

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
      if (initialPost) {
        // Update existing post
        console.log("Updating post:", {
          id: currentUser.data._id.toString(),
          title,
          content,
          featureImage,
          categories,
          tags,
        });
      } else {
        // Create new post
        console.log("Creating new post:", {
          id: `${currentUser.data._id}`,
          title,
          content,
          featureImage,
          categories,
          tags,
        });

        mutate({
          id: `${currentUser.data._id}`,
          title,
          content,
          featureImage,
          categories,
          tags,
        });
        console.log("Data:", data);
        console.log("Status:", status);
        console.log("Error:", error);
      }
    },
    [title, content, featureImage, categories, tags, initialPost]
  );
  return {
    title,
    content,
    featureImage,
    tags,
    categories,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleImageUpload,
    setFeatureImage,
    setTags,
    setCategories,
  };
};
