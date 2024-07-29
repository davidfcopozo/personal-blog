import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const useBlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [featureImage, setFeatureImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const { toast } = useToast();

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

  const handleSubmit = (e: FormEvent) => {
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
  };

  return {
    title,
    content,
    featureImage,
    tags,
    category,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleImageUpload,
    setFeatureImage,
    setTags,
    setCategory,
  };
};
