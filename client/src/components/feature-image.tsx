import Image from "next/image";
import { UploadIcon, XIcon } from "./icons";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FeatureImageProps } from "@/typings/interfaces";
import { ChangeEvent, useRef } from "react";

const FeatureImage = ({
  imageUrl,
  onUpload,
  temporaryFeatureImage,
}: FeatureImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpload(file);
    }
  };

  const displayImage = temporaryFeatureImage
    ? URL.createObjectURL(temporaryFeatureImage)
    : imageUrl;
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Feature Image</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-4 px-2">
        <div className="grid gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-[80%] mx-auto text-center"
            onClick={handleUploadClick}
          >
            <UploadIcon classes="mr-1 h-4 w-4" />
            Upload Image
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className="gap-2 mx-auto">
            {displayImage && (
              <Image
                src={displayImage}
                alt="Temporary Feature Image"
                width={300}
                height={200}
                className="rounded-lg w-full h-auto"
                style={{ objectFit: "cover" }}
                priority
              />
            )}
            {displayImage && (
              <Button
                variant="ghost"
                size="icon"
                className="w-[50%] my-2 mx-auto text-center"
                onClick={() => onUpload(null)}
              >
                <XIcon classes="h-3 w-3 mr-1" />
                Remove
                <span className="sr-only">Remove Image</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default FeatureImage;
