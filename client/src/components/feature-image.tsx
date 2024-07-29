import Image from "next/image";
import { UploadIcon, XIcon } from "./icons";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const FeatureImage = () => {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Feature Image</CardTitle>
      </CardHeader>
      <CardContent className="p-0 px-2">
        <div className="grid gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-[80%] mx-auto text-center"
          >
            <UploadIcon className="mr-1 h-4 w-4" />
            Upload Image
          </Button>
          <div className="gap-2 mx-auto">
            {true && (
              <Image
                src="/new-img.png"
                alt="Feature Image"
                width={300}
                height={200}
                className="rounded-lg object-cover 100%"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="w-[50%] my-2 mx-auto text-center"
            >
              <XIcon className="h-3 w-3 mr-1" />
              Remove
              <span className="sr-only">Remove Image</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureImage;
