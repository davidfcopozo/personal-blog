import { ImageGalleryPropsInterface } from "@/typings/interfaces";
import { ImageCard } from "./image-gallery-card";

export function ImageGallery({
  images,
  selectedImage,
  onSelect,
  onDoubleClick,
}: ImageGalleryPropsInterface & { onDoubleClick: (image: any) => void }) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No images available</p>
        <p className="text-sm text-gray-400">Upload images to see them here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {images.map((image) => (
        <div key={image.id} onDoubleClick={() => onDoubleClick(image)}>
          <ImageCard
            image={image}
            isSelected={selectedImage?.id === image.id}
            onSelect={() => onSelect(image)}
          />
        </div>
      ))}
    </div>
  );
}
