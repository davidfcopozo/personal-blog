import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";

interface UploadButtonProps {
  onUpload: (files: File[]) => void;
}

export function UploadButton({ onUpload }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("settings");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(Array.from(event.target.files));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="mb-4">
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />
      <label htmlFor="file-upload">
        <span className="w-full">
          <Button
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {t("uploadImages")}
          </Button>
        </span>
      </label>
    </div>
  );
}
