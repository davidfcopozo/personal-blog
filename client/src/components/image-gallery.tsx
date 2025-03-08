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
      <div className="text-center p-8 bg-muted rounded-lg">
        <p className="text-muted-foreground">No images available</p>
        <p className="text-sm text-muted-foreground opacity-70">
          Upload images to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {images.map((image) => (
        <div key={image._id} onDoubleClick={() => onDoubleClick(image)}>
          <ImageCard
            image={image}
            isSelected={selectedImage?._id === image._id}
            onSelect={() => onSelect(image)}
          />
        </div>
      ))}
    </div>
  );
}
