import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardFooter } from "@/components/ui/card";

export function PostSkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={`overflow-hidden border-none shadow-lg mb-6 ${className}`}>
      <div className="flex flex-col md:flex-row">
        {/* Featured Image Skeleton */}
        <div className="relative h-48 w-full md:w-2/5">
          <Skeleton className="h-full w-full" />
          {/* Reading time pill */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-5">
          {/* Author info */}
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="text-sm">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Post title and excerpt */}
          <div className="flex-1">
            <Skeleton className="mb-2 text-xl font-bold h-7 w-full max-w-[300px]" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full max-w-[85%]" />
          </div>

          {/* Footer with engagement buttons - matches the NewBlogPostCard layout */}
          <CardFooter className="flex justify-between p-0 pt-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-6 w-16" />
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
