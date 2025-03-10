import Image from "next/image";
import { UploadIcon, XIcon } from "./icons";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FeatureImageProps } from "@/typings/interfaces";
import { ChangeEvent, useRef, useState } from "react";
import { useImageManager } from "@/hooks/useImageManager";
import { ImageUploadModal } from "./image-upload-modal";

const FeatureImage = ({
  imageUrl,
  onUpload,
  temporaryFeatureImage,
}: FeatureImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, userImages, isLoadingImages, deleteImage } =
    useImageManager();
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGalleryUrl, setSelectedGalleryUrl] = useState<string | null>(
    null
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleBrowseGallery = () => {
    setIsImageGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsImageGalleryOpen(false);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        setIsUploading(true);
        // Store in DB as well for future reuse
        await uploadImage(file);
        setIsUploading(false);

        // Pass the file to the parent component for immediate use
        onUpload(file);
      } catch (error) {
        console.error("Error uploading feature image:", error);
        setIsUploading(false);
      }
    }
  };

  const handleImageSelect = (url: string) => {
    setSelectedGalleryUrl(url);
    onUpload({
      url,
      isDirectUrl: true,
    } as any);
  };

  const displayImage =
    selectedGalleryUrl ||
    (temporaryFeatureImage
      ? URL.createObjectURL(temporaryFeatureImage)
      : imageUrl);

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Feature Image</CardTitle>
      </CardHeader>
      <CardContent className="py-4 px-2">
        <div className="grid gap-2 w-full">
          <div className="flex flex-col gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              <UploadIcon classes="mr-1 h-4 w-4" />
              Upload New
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBrowseGallery}
              disabled={isUploading}
            >
              <svg
                className="mr-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Browse Gallery
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className="gap-2 mx-auto px-8">
            {isUploading && (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">
                  Uploading image...
                </p>
              </div>
            )}
            {displayImage && !isUploading && (
              <>
                <Image
                  src={displayImage}
                  alt="Feature Image"
                  width={300}
                  height={200}
                  className="rounded-lg w-full h-auto"
                  style={{ objectFit: "cover" }}
                  priority
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-[50%] my-2 mx-auto text-center"
                  onClick={() => {
                    onUpload(null);
                    setSelectedGalleryUrl(null);
                  }}
                >
                  <XIcon classes="h-3 w-3 mr-1" />
                  Remove
                  <span className="sr-only">Remove Image</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>

      {/* Image Gallery Modal */}
      <ImageUploadModal
        isImageUploadModalOpen={isImageGalleryOpen}
        openImageUploadModal={() => setIsImageGalleryOpen(!isImageGalleryOpen)}
        onInsertImage={handleImageSelect}
        handleImageUpload={uploadImage}
        images={userImages}
        onDeleteImage={deleteImage}
        isLoadingImages={isLoadingImages}
        buttonText="Select Image"
      />
    </Card>
  );
};
export default FeatureImage;
