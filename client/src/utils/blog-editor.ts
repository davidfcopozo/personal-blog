import {
  DeleteImageFromFirebaseType,
  ExtractImagesFromContentType,
} from "@/typings/types";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebaseConfig";

export const extractImagesFromContent: ExtractImagesFromContentType = (
  content
) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const images = Array.from(doc.querySelectorAll("img"));
  return images.map((img) => img.src);
};

export const deleteImageFromFirebase: DeleteImageFromFirebaseType = async (
  imageUrl
) => {
  try {
    const imagePath = imageUrl.split("images%2F")[1]?.split("?")[0];
    const imageRef = ref(storage, `images/${imagePath}`);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
