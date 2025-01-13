import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] text-center px-4">
      <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold mb-2">Post Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! The post you're looking for doesn't seem to exist.
      </p>
      <Button asChild>
        <Link href="/">Go to Home Page</Link>
      </Button>
    </div>
  );
}
