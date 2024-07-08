import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeletonCard() {
  return (
    <div className="space-y-3 max-w-sm w-full transition-all duration-300 lg:max-w-full lg:flex">
      <Skeleton className="h-48 lg:h-28 lg:w-60" />
      <div className="space-y-2 lg:ml-4 lg:w-[50vw] lg:align-center">
        <Skeleton className="h-4 max-w-[400px] sm:max-w-[230px] md:max-w-[385px] lg:max-w-[485px]" />
        <Skeleton className="h-4 max-w-[350px] sm:max-w-[180px] md:max-w-[340px] lg:max-w-[440px]" />
        <Skeleton className="invisible h-4 lg:visible lg:h-4 lg:max-w-[300px]" />
      </div>
    </div>
  );
}
