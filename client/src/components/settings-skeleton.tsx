import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col mt-16 md:mt-12 min-h-[100dvh]">
      <div className="container mx-auto px-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
          {/* Tabs Section */}
          <div className="col-span-2 md:col-span-2">
            <Card className="p-6">
              <Tabs defaultValue="personal" className="w-full">
                <Card className="flex w-full  p-2 gap-2">
                  <Skeleton className="h-8 w-[33%]" />
                  <Skeleton className="h-8 w-[33%]" />
                  <Skeleton className="h-8 w-[33%]" />
                </Card>
                <TabsContent value="personal">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="social">
                  <Skeleton className="h-40 w-full" />
                </TabsContent>
                <TabsContent value="custom">
                  <Skeleton className="h-40 w-full" />
                </TabsContent>
                <div className="flex pt-4 justify-start">
                  <Skeleton className="h-10 w-32" />
                </div>
              </Tabs>
            </Card>
          </div>
          {/* User Info Section */}
          <div className="col-span-1 md:col-span-1">
            <Card className="p-4">
              <div className="flex flex-col items-center justify-center mb-4">
                <Skeleton className="h-48 w-48 rounded-full mb-4" />
                <div className="flex flex-col space-y-2 w-full">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="text-center">
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-4 w-2/3 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/3 mx-auto" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
