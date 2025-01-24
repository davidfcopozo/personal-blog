import { ImageGalleryPropsInterface } from "@/typings/interfaces";
import { ImageCard } from "./image-gallery-card";

export function ImageGallery({
  images,
  selectedImage,
  onSelect,
}: ImageGalleryPropsInterface) {
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No images found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedImage?.id === image.id}
          onSelect={() => onSelect(image)}
        />
      ))}
    </div>
  );
}
