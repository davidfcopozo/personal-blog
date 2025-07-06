"use client";
import Link from "next/link";
import {
  CircleUser,
  LayoutDashboard,
  PlusCircle,
  Settings,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useCallback, useMemo, useState } from "react";
import userPosts from "@/hooks/useUserPosts";
import { useSession } from "next-auth/react";
import { PostType } from "@/typings/types";
import { useRouter } from "next/navigation";
import useDeletePost from "@/hooks/useDeletePost";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PostsTabContent from "./posts-tab-component";
import { PostPerformance } from "./post-performance";
import { Analytics } from "./analytics";

export function Dashboard() {
  const [postStatus, setPostStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostType | null>(null);
  const { data: user } = useSession();
  const { deletePost, status } = useDeletePost();
  const router = useRouter();

  const { blogPosts, arePostsFetching, arePostsLoading } = userPosts(
    user?.user?.id || ""
  );

  function handleDeletePost(post: PostType) {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  }

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post: PostType) => {
      if (postStatus === "all") return true;
      if (postStatus === "published") return post.status === "published";
      if (postStatus === "unpublished") return post.status === "unpublished";
      if (postStatus === "draft") return post.status === "draft";
      return true;
    });
  }, [blogPosts, postStatus]);

  const handleEditPost = useCallback(
    (slug: string) => {
      router.push(`/edit-post/${slug}`);
    },
    [router]
  );

  function handleNewPost() {
    router.push("/new");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-16">
      <aside className="fixed inset-y-0 left-0 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center mt-16 gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    activeTab === "dashboard"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutDashboard strokeWidth={2.2} className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("performance")}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    activeTab === "performance"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BarChart3 strokeWidth={2.2} className="h-5 w-5" />
                  <span className="sr-only">Post Performance</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Post Performance</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    activeTab === "analytics"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TrendingUp strokeWidth={2.2} className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <CircleUser strokeWidth={2.25} className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {activeTab === "dashboard" && (
            <Tabs defaultValue="all">
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setPostStatus("all")}>
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="published"
                    onClick={() => setPostStatus("published")}
                  >
                    Published
                  </TabsTrigger>
                  <TabsTrigger
                    value="unpublished"
                    onClick={() => setPostStatus("unpublished")}
                  >
                    Unpublished
                  </TabsTrigger>
                  <TabsTrigger
                    value="draft"
                    onClick={() => setPostStatus("draft")}
                  >
                    Draft
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 gap-1"
                    onClick={handleNewPost}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add New Post
                    </span>
                  </Button>
                </div>
              </div>
              <TabsContent value="all">
                <PostsTabContent
                  filteredPosts={filteredPosts}
                  arePostsFetching={arePostsFetching}
                  arePostsLoading={arePostsLoading}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                  status={status}
                />
              </TabsContent>
              <TabsContent value="published">
                <PostsTabContent
                  filteredPosts={filteredPosts}
                  arePostsFetching={arePostsFetching}
                  arePostsLoading={arePostsLoading}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                  status={status}
                />
              </TabsContent>
              <TabsContent value="unpublished">
                <PostsTabContent
                  filteredPosts={filteredPosts}
                  arePostsFetching={arePostsFetching}
                  arePostsLoading={arePostsLoading}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                  status={status}
                />
              </TabsContent>
              <TabsContent value="draft">
                <PostsTabContent
                  filteredPosts={filteredPosts}
                  arePostsFetching={arePostsFetching}
                  arePostsLoading={arePostsLoading}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                  status={status}
                />
              </TabsContent>
            </Tabs>
          )}

          {activeTab === "performance" && <PostPerformance />}

          {activeTab === "analytics" && <Analytics />}
        </main>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-background border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this comment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => postToDelete && deletePost(postToDelete)}
              className="bg-destructive text-foreground hover:bg-destructive hover:opacity-90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
