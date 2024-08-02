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
      await queryClient.cancelQueries({
        queryKey: ["posts"],
        exact: true,
      });

      queryClient.setQueryData(["posts"], (oldData: InitialPost[]) => [
        {
          ...oldData,
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
    const currentUser: any = await queryClient.getQueryData(["currentUser"]);
    let currentUserId: string = await currentUser?.data._id;
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
    const currentUser: any = await queryClient.getQueryData(["currentUser"]);

    let currentUserId = await currentUser?.data._id;
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
          title,
          content,
          featureImage,
          categories,
          tags,
        });
      } else {
        // Create new post
        console.log("Creating new post:", {
          title,
          content,
          featureImage,
          categories,
          tags,
        });

        mutate({
          title,
          content,
          featureImage,
          categories,
          tags,
        });

        if (!error) {
          setTitle("");
          setContent("");
          setFeatureImage(null);
          setCategories([]);
          setTags([]);
        }
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
