"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageInfoPanel } from "./image-info-panel";
import { UploadButton } from "./image-upload-button";
import { ImageUploader } from "./image-uploader";
import { SearchAndFilter } from "./search-and-filter";
import { ImageInterface } from "@/typings/interfaces";

export function ImageUploadModal({
  isImageUploadModalOpen,
  openImageUploadModal,
  onInsertImage,
  handleImageUpload,
  images,
  setImages,
}: {
  isImageUploadModalOpen: boolean;
  openImageUploadModal: () => void;
  onInsertImage: (url: string) => void;
  handleImageUpload: (file: File) => Promise<string>;
  images: ImageInterface[];
  setImages: React.Dispatch<React.SetStateAction<ImageInterface[]>>;
}) {
  const [selectedImage, setSelectedImage] = useState<ImageInterface | null>(
    null
  );

  const handleFileUpload = async (files: File[]) => {
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const url = await handleImageUpload(file);
        return {
          id: url,
          name: file.name,
          url,
          size: file.size,
          type: file.type,
          dimensions: "0x0",
          uploadDate: new Date(),
        };
      })
    );
    setImages((prev) => [...prev, ...uploaded]);
  };

  const handleInsert = () => {
    if (selectedImage) {
      onInsertImage(selectedImage.url);
      openImageUploadModal();
    }
  };

  return (
    <>
      <Dialog open={isImageUploadModalOpen} onOpenChange={openImageUploadModal}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Image Upload</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
              <UploadButton onUpload={handleFileUpload} />
              <SearchAndFilter images={images} />
              <ImageUploader onUpload={() => {}} />
            </div>
            <div className="w-full lg:w-1/3 max-h-[30vh] lg:max-h-[70vh] overflow-y-auto">
              <ImageInfoPanel
                image={selectedImage}
                onDelete={() => {}}
                onUpdate={() => {}}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
