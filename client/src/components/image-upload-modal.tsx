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
import { Loader2 } from "lucide-react";

export function ImageUploadModal({
  isImageUploadModalOpen,
  openImageUploadModal,
  onInsertImage,
  handleImageUpload,
  images,
  onDeleteImage,
  isLoadingImages,
  buttonText = "Insert Image",
}: {
  isImageUploadModalOpen: boolean;
  openImageUploadModal: () => void;
  onInsertImage: (url: string) => void;
  handleImageUpload: (file: File) => Promise<string>;
  images: ImageInterface[];
  onDeleteImage: (id: string) => Promise<void>;
  isLoadingImages: boolean;
  buttonText?: string; // Add this prop for customizing the button text
}) {
  const [selectedImage, setSelectedImage] = useState<ImageInterface | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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
    setIsProcessing(true);
    try {
      await Promise.all(files.map((file) => handleImageUpload(file)));
      setIsProcessing(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setIsProcessing(false);
    }
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

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    try {
      await onDeleteImage(id);

      if (selectedImage?._id === id) {
        setSelectedImage(null);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error("Error deleting image:", error);
      setIsProcessing(false);
    }
  };

  const handleUpdate = (id: string, updates: Partial<ImageInterface>) => {
    // This will be implemented in the future with the updateImageMetadata function
    console.log("Update image:", id, updates);
  };

  return (
    <>
      <Dialog open={isImageUploadModalOpen} onOpenChange={openImageUploadModal}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Image Gallery</DialogTitle>
          </DialogHeader>
          {(isLoadingImages || isProcessing) && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">
                {isProcessing ? "Processing..." : "Loading images..."}
              </span>
            </div>
          )}
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
            <Button
              onClick={handleInsert}
              disabled={!selectedImage || isProcessing}
            >
              {buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
