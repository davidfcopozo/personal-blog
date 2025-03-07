import { Skeleton } from "@/components/ui/skeleton";

export default function QuillLoadingSkeleton() {
  return (
    <div className="w-full h-screen rounded-lg bg-background">
      {/* Header/Title area */}
      <div className="border p-2 rounded-md mb-4 w-full">
        <Skeleton className="h-6 w-3/4" />
      </div>
      <div className="border py-2 px-4  rounded-md">
        {/* Toolbar */}
        <div className="flex items-center border-b py-2 md:space-x-1 flex-wrap gap-y-2 gap-x-1 ">
          <Skeleton className="h-8 w-8" /> {/* Undo */}
          <Skeleton className="h-8 w-8" /> {/* Redo */}
          <div className="!mx-2 h-4 w-px bg-border" /> {/* Divider */}
          <Skeleton className="h-8 w-16" /> {/* Header dropdown */}
          <div className="!mx-2 h-4 w-px bg-border" /> {/* Divider */}
          <div className="flex space-x-1">
            <Skeleton className="h-8 w-8" /> {/* Bold */}
            <Skeleton className="h-8 w-8" /> {/* Italic */}
            <Skeleton className="h-8 w-8" /> {/* Underline */}
          </div>
          <div className="m!x-2 h-4 w-px bg-border" /> {/* Divider */}
          <div className="flex space-x-1">
            <Skeleton className="h-8 w-8" /> {/* Align left */}
            <Skeleton className="h-8 w-8" /> {/* Align center */}
            <Skeleton className="h-8 w-8" /> {/* Align right */}
          </div>
          <div className="!mx-2 h-4 w-px bg-border" /> {/* Divider */}
          <Skeleton className="h-8 w-24" /> {/* Font dropdown */}
        </div>

        {/* Content area */}
        <div className="space-y-2 py-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[85%] !mb-4" />
          <Skeleton className="min-h-36 sm:min-h-56 w-[65%] !mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[85%]" />
        </div>
      </div>
    </div>
  );
}
