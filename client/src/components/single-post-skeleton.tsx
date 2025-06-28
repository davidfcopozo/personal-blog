import { Skeleton } from "@/components/ui/skeleton";

export default function SinglePostSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Engagement Tools (Desktop only) */}
          <div className="order-2 lg:order-1 lg:w-20 hidden lg:block">
            <div className="lg:sticky bg-muted lg:top-[5.5rem] flex lg:flex-col justify-center gap-2 p-4 rounded-3xl shadow-sm animate-pulse">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </div>

          {/* Main Content */}
          <main className="order-1 lg:order-2 lg:flex-1">
            <article className="rounded-lg overflow-hidden mt-6 animate-pulse">
              <div className="flex flex-col">
                {/* Cover Image */}
                <div className="w-full order-2 lg:order-1 rounded-lg overflow-hidden h-[50vh] sm:h-[60vh] md:h-[70vh] relative">
                  <Skeleton className="w-full h-full" />
                </div>

                {/* Metadata and Title */}
                <div className="order-1 mx-auto w-[90%] lg:mx-0 lg:w-full lg:order-2 flex flex-col gap-4 p-4">
                  {/* METADATA */}
                  <div className="flex flex-col md:gap-4 order-2 lg:order-1 gap-2 items-center pt-4 lg:pt-0">
                    <div className="flex w-full justify-between items-center text-sm lg:mb-6">
                      <div className="flex gap-2 items-center">
                        {/* Author avatar (mobile) */}
                        <div className="flex lg:hidden gap-2 items-center">
                          <Skeleton className="w-14 h-14 rounded-full" />
                        </div>
                        <div className="flex flex-col gap-1">
                          {/* Author name and follow button (mobile) */}
                          <div className="lg:hidden flex items-center gap-2">
                            <Skeleton className="h-4 w-32" />
                            <span className="mx-2">•</span>
                            <Skeleton className="h-4 w-16" />
                          </div>
                          {/* Reading time and date */}
                          <div className="flex items-center gap-1">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-16" />
                            <span className="mx-2">•</span>
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      </div>
                      {/* Views count */}
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>

                    {/* Engagement buttons (mobile) */}
                    <div className="flex lg:hidden w-[100%] border-y-[1px] mt-2 py-2">
                      <div className="flex w-[100%] justify-between items-center">
                        <div className="flex gap-4">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="order-1 lg:order-2 text-center">
                    <Skeleton className="h-8 md:h-10 lg:h-12 w-full max-w-3xl mx-auto mb-4" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="py-6 bg-background">
                <div className="md:w-[80%] w-[90%] mx-auto space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />

                  <div className="py-4">
                    <Skeleton className="h-40 w-full rounded-lg" />
                  </div>

                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              </div>

              {/* Comments Section */}
              <div className="py-6 border-t">
                <div className="md:w-[80%] w-[90%] mx-auto">
                  <Skeleton className="h-8 w-48 mb-6" />

                  {/* Comment Editor */}
                  <div className="mb-6">
                    <Skeleton className="h-32 w-full rounded-md" />
                  </div>

                  {/* Comments */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <div className="flex items-center gap-4 mt-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </main>

          {/* Right Panel - Author Info (Desktop only) */}
          <div className="order-3 w-72 mx-auto hidden lg:block">
            <div className="lg:mt-6 animate-pulse">
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />

                  {/* Social media links */}
                  <div className="flex gap-4 mb-4">
                    <Skeleton className="w-6 h-6 rounded" />
                    <Skeleton className="w-6 h-6 rounded" />
                    <Skeleton className="w-6 h-6 rounded" />
                  </div>

                  {/* Follow button */}
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
