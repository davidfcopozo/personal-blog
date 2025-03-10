import { ImageInterface } from "@/typings/interfaces";
import { useState, useEffect } from "react";

export function useImageSelection(images: ImageInterface[]) {
  const [selectedImage, setSelectedImage] = useState<ImageInterface | null>(null);

  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  const selectImage = (image: ImageInterface) => {
    setSelectedImage(image);
  };

  return { selectedImage, selectImage };
}
