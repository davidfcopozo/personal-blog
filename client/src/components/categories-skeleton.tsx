import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesSkeleton() {
  return (
    <div className="flex flex-wrap space-between gap-2 py-4 px-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-8 w-16 rounded-full sm:w-20 md:w-24 lg:w-28"
        />
      ))}
    </div>
  );
}
