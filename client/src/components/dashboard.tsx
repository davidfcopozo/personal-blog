"use client";
import Link from "next/link";
import {
  CircleUser,
  LayoutDashboard,
  MoreHorizontal,
  PlusCircle,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { posts } from "@/lib/testDatabase.json";
import { showMonthDayYear } from "@/utils/formats";
import { useState } from "react";
import userPosts from "@/lib/userPosts";
import { useSession } from "next-auth/react";
import { CategoryType, PostType } from "@/typings/types";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { useRouter } from "next/navigation";

export function Dashboard() {
  const [postStatus, setPostStatus] = useState("all");
  const { data: user } = useSession();
  //function to route to edit post page with useRouter
  const router = useRouter();

  const { blogPosts, arePostsFetching, arePostsLoading } = userPosts(
    user?.user?.id || ""
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-16">
      <aside className="fixed inset-y-0 left-0 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center mt-16 gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LayoutDashboard strokeWidth={2.2} className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
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
                  value="draft"
                  onClick={() => setPostStatus("draft")}
                >
                  Draft
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add New Post
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value={postStatus}>
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Posts</CardTitle>
                  <CardDescription>
                    Manage your blog posts and view their interaction
                    performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Likes
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Comments
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Categories
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Vistis
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {blogPosts.length > 0 ? (
                        blogPosts.map(
                          (post: PostType, key: number | string) => (
                            <TableRow key={key}>
                              <TableCell id="title" className="font-medium">
                                {post.title}
                              </TableCell>
                              <TableCell id="status">
                                <Badge variant="outline">
                                  {post.published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell
                                id="likes"
                                className="hidden md:table-cell"
                              >
                                {post.likes?.length}
                              </TableCell>
                              <TableCell
                                id="comments"
                                className="hidden md:table-cell"
                              >
                                {post.comments?.length}
                              </TableCell>
                              <TableCell
                                id="categories"
                                className="hidden md:table-cell"
                              >
                                {post.categories?.map(
                                  (category: CategoryType) => (
                                    <span key={category._id.toString()}>
                                      {category.name}
                                      {(post.categories?.length ?? 0) - 1 !==
                                      post.categories?.indexOf(category)
                                        ? ", "
                                        : ""}
                                    </span>
                                  )
                                )}
                              </TableCell>
                              <TableCell
                                id="visits"
                                className="hidden md:table-cell"
                              >
                                {post.visits}
                              </TableCell>
                              <TableCell
                                id="date"
                                className="hidden md:table-cell"
                              >
                                {showMonthDayYear(
                                  post.createdAt?.toString() || ""
                                )}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                      className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        Toggle menu
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(`/edit-post/${post.slug}`)
                                      }
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        )
                      ) : arePostsFetching || arePostsLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <DashboardSkeleton />
                          </TableRow>
                        ))
                      ) : (
                        <TableCell className="pt-4 lg:text-md">
                          No posts found
                        </TableCell>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>

                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of{" "}
                    <strong>{posts?.length}</strong> posts
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
