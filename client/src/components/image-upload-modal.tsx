"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageInfoPanel } from "./image-info-panel";
import { UploadButton } from "./image-upload-button";
import { SearchAndFilter } from "./search-and-filter";
import { ImageInterface } from "@/typings/interfaces";
import { ImageGallery } from "./image-gallery";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredImages = searchQuery
    ? images.filter(
        (img) =>
          img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (img.title &&
            img.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (img.tags &&
            img.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      )
    : images;

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
      closeModal();
    }
  };

  const handleDoubleClickInsert = (image: ImageInterface) => {
    onInsertImage(image.url);
    closeModal();
  };

  const closeModal = () => {
    openImageUploadModal();
  };

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const handleUpdate = (id: string, updates: Partial<ImageInterface>) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );

    if (selectedImage?.id === id) {
      setSelectedImage((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  return (
    <>
      <Dialog open={isImageUploadModalOpen} onOpenChange={openImageUploadModal}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Image Gallery</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
              <UploadButton onUpload={handleFileUpload} />
              <SearchAndFilter
                images={images}
                onSearch={(query) => setSearchQuery(query)}
              />
              <ImageGallery
                images={filteredImages}
                selectedImage={selectedImage}
                onSelect={setSelectedImage}
                onDoubleClick={handleDoubleClickInsert}
              />
            </div>
            <div className="w-full lg:w-1/3 max-h-[30vh] lg:max-h-[70vh] overflow-y-auto">
              <ImageInfoPanel
                image={selectedImage}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleInsert} disabled={!selectedImage}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
