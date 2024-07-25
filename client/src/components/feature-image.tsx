import { UploadIcon, XIcon } from "./icons";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const FeatureImage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 ">
          <Button variant="outline" size="sm" className="w-[80%]">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <div className="grid gap-2">
            <img
              src="/placeholder.svg"
              alt="Feature Image"
              width={300}
              height={200}
              className="rounded-lg object-cover"
            />
            <Button variant="ghost" size="icon" className="justify-end">
              <XIcon className="h-2 w-2" />
              <span className="sr-only">Remove Image</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureImage;
