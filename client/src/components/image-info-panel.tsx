import { Button } from "@/components/ui/button";
import { EditableImageProperties } from "./editable-image-properties";
import { Separator } from "@/components/ui/separator";
import type { ImageInfoPanelPropsInterface } from "@/typings/interfaces";
import Image from "next/image";
import { formatFileSize, showMonthDayYear } from "@/utils/formats";

export function ImageInfoPanel({
  image,
  onDelete,
  onUpdate,
}: ImageInfoPanelPropsInterface) {
  if (!image) {
    return (
      <div className="bg-muted rounded-lg p-4">
        <p className="text-muted-foreground">Select an image to view details</p>
      </div>
    );
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image.url);
  };

  return (
    <div className="bg-background rounded-lg shadow-sm border p-4 space-y-4">
      <Image
        src={image.url || "/placeholder.svg"}
        alt={image.name}
        className="w-full h-full object-cover rounded-md"
        width={500}
        height={500}
      />

      <div className="space-y-2">
        <h3 className="font-bold text-lg">Image Information</h3>
        <p className="text-sm text-muted-foreground">File name: {image.name}</p>
        <p className="text-sm text-muted-foreground">
          Uploaded on: {showMonthDayYear(image.uploadDate.toISOString())}
        </p>
        <p className="text-sm text-muted-foreground">
          Size: {formatFileSize(image.size)}
        </p>
        <p className="text-sm text-muted-foreground">
          Dimensions: {image.dimensions}
        </p>
        <p className="text-sm text-muted-foreground">Type: {image.type}</p>
      </div>

      <Separator />

      <EditableImageProperties image={image} onUpdate={onUpdate} />

      <Separator />

      <div className="flex flex-col gap-2">
        <Button onClick={handleCopyUrl}>Copy URL</Button>
        <Button variant="destructive" onClick={() => onDelete(image.id)}>
          Delete Image
        </Button>
      </div>
    </div>
  );
}
