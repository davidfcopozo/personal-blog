import { Button } from "@/components/ui/button";
import { EditableImageProperties } from "./editable-image-properties";
import { Separator } from "@/components/ui/separator";
import type { ImageInfoPanelPropsInterface } from "@/typings/interfaces";
import Image from "next/image";
import { formatFileSize, showMonthDayYear } from "@/utils/formats";
import { useLocale, useTranslations } from "next-intl";

export function ImageInfoPanel({
  image,
  onDelete,
  onUpdate,
}: ImageInfoPanelPropsInterface) {
  const locale = useLocale();
  const t = useTranslations("settings");

  if (!image) {
    return (
      <div className="bg-muted rounded-lg p-4">
        <p className="text-muted-foreground">{t("selectImageToView")}</p>
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
        <h3 className="font-bold text-lg">{t("imageInformation")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("fileName")} {image.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("uploadedOn")}{" "}
          {showMonthDayYear(`${image.createdAt}`, locale as "en" | "es")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("size")} {formatFileSize(image.size)}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("dimensions")} {image.dimensions}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("type")} {image.type}
        </p>
      </div>

      <Separator />

      <EditableImageProperties image={image} onUpdate={onUpdate} />

      <Separator />

      <div className="flex flex-col gap-2">
        <Button onClick={handleCopyUrl}>{t("copyUrl")}</Button>
        <Button variant="destructive" onClick={() => onDelete(image._id)}>
          {t("deleteImage")}
        </Button>
      </div>
    </div>
  );
}
