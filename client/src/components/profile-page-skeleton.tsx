import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information Skeleton */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-[150px] w-[150px] rounded-full mb-4" />
                  <Skeleton className="h-8 w-[200px] mb-2" />
                  <Skeleton className="h-4 w-[250px] mb-4" />
                  <Skeleton className="h-4 w-[200px] mb-4" />
                  <div className="flex space-x-4 mb-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blog Posts Skeleton */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b pb-4 last:border-b-0">
                      <Skeleton className="h-6 w-full mb-2" />
                      <div className="flex justify-between items-center mt-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
