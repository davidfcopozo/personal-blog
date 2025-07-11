"use client";
import { MoreHorizontal } from "lucide-react";
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
import { memo } from "react";
import { CategoryType, PostType } from "@/typings/types";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { showMonthDayYear } from "@/utils/formats";
import React, { useState, useMemo } from "react";
import SortIndicator from "./ui/sort-indicator";
import Link from "next/link";

const PostsTabContent = memo(
  ({
    filteredPosts,
    arePostsFetching,
    arePostsLoading,
    onEditPost,
    onDeletePost,
    status,
  }: {
    filteredPosts: PostType[];
    arePostsFetching: boolean;
    arePostsLoading: boolean;
    onEditPost: (slug: string) => void;
    onDeletePost: (post: PostType) => void;
    status: string;
  }) => {
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);

    const sortedPosts = useMemo(() => {
      if (!sortConfig) return filteredPosts;

      return [...filteredPosts].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Handle special cases for sorting
        switch (sortConfig.key) {
          case "comments":
            aValue = a.comments?.length || 0;
            bValue = b.comments?.length || 0;
            break;
          case "likesCount":
            aValue = a.likesCount || 0;
            bValue = b.likesCount || 0;
            break;
          case "bookmarksCount":
            aValue = a.bookmarksCount || 0;
            bValue = b.bookmarksCount || 0;
            break;
          case "sharesCount":
            aValue = a.sharesCount || 0;
            bValue = b.sharesCount || 0;
            break;
          case "visits":
            aValue = a.visits || 0;
            bValue = b.visits || 0;
            break;
          case "createdAt":
            aValue = new Date(a.createdAt || 0).getTime();
            bValue = new Date(b.createdAt || 0).getTime();
            break;
          default:
            aValue = a[sortConfig.key as keyof PostType];
            bValue = b[sortConfig.key as keyof PostType];
        }

        if (aValue === bValue) return 0;

        if (aValue === undefined || bValue === undefined) return 0;

        const comparison = aValue > bValue ? 1 : -1;

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }, [filteredPosts, sortConfig]);

    const handleSort = (key: string) => {
      setSortConfig((prevSort) => {
        if (prevSort?.key === key) {
          return {
            key,
            direction: prevSort.direction === "asc" ? "desc" : "asc",
          };
        }
        return { key, direction: "asc" };
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>
            Manage your blog posts and view their interaction performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("title")}
                    className="cursor-pointer min-w-[200px]"
                  >
                    <SortIndicator
                      title="Title"
                      direction={sortConfig?.direction}
                      size={12}
                      strokeWidth={3}
                      isActive={sortConfig?.key === "title"}
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("status")}
                    className="cursor-pointer min-w-[100px]"
                  >
                    <SortIndicator
                      title="Status"
                      direction={sortConfig?.direction}
                      size={12}
                      strokeWidth={3}
                      isActive={sortConfig?.key === "status"}
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("createdAt")}
                    className="cursor-pointer min-w-[120px]"
                  >
                    <SortIndicator
                      title="Date"
                      direction={sortConfig?.direction}
                      size={12}
                      strokeWidth={3}
                      isActive={sortConfig?.key === "createdAt"}
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("visits")}
                    className="cursor-pointer min-w-[100px]"
                  >
                    <SortIndicator
                      title="Visits"
                      direction={sortConfig?.direction}
                      size={12}
                      strokeWidth={3}
                      isActive={sortConfig?.key === "visits"}
                    />
                  </TableHead>
                  <TableHead className="min-w-[150px]">Categories</TableHead>
                  <TableHead
                    onClick={() => handleSort("likesCount")}
                    className="cursor-pointer min-w-[100px]"
                  >
                    <SortIndicator
                      title="Likes"
                      direction={sortConfig?.direction}
                      size={12}
                      strokeWidth={3}
                      isActive={sortConfig?.key === "likesCount"}
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("comments")}
                    className="cursor-pointer min-w-[100px]"
                  >
                    <SortIndicator
                      title="Comments"
                      direction={sortConfig?.direction}
                      size={12}
                      strokeWidth={3}
                      isActive={sortConfig?.key === "comments"}
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("bookmarksCount")}
                    className="cursor-pointer min-w-[120px]"
                  >
                    <SortIndicator
                      title="Bookmarks"
                      direction={sortConfig?.direction}
                      size={12}
                      strokeWidth={3}
                      isActive={sortConfig?.key === "bookmarksCount"}
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("sharesCount")}
                    className="cursor-pointer min-w-[100px]"
                  >
                    <SortIndicator
                      title="Shares"
                      direction={sortConfig?.direction}
                      size={12}
                      strokeWidth={3}
                      isActive={sortConfig?.key === "sharesCount"}
                    />
                  </TableHead>
                  <TableHead className="min-w-[80px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPosts.length > 0 ? (
                  sortedPosts.map((post: PostType) => (
                    <TableRow key={post._id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/${post.postedBy.username}/${post.slug}`}
                          className="hover:underline"
                        >
                          {post?.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {post?.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {showMonthDayYear(post?.createdAt?.toString() || "")}
                      </TableCell>
                      <TableCell>
                        {(post?.visits || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {post?.categories && post.categories.length > 0 ? (
                            <>
                              {post.categories
                                .slice(0, 2)
                                .map((category: CategoryType) => (
                                  <Badge
                                    key={category._id.toString()}
                                    variant="secondary"
                                    className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 truncate max-w-[80px] sm:max-w-[120px]"
                                    title={category.name.toString()}
                                  >
                                    {category.name}
                                  </Badge>
                                ))}
                              {post.categories.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-0.5"
                                >
                                  +{post.categories.length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-0.5"
                            >
                              No categories
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(post?.likesCount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {(post?.comments?.length || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {(post?.bookmarksCount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {(post?.sharesCount || 0).toLocaleString()}
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
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="border-b-[1px]">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => onEditPost(post.slug)}
                              className="cursor-pointer"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={status === "pending"}
                              onClick={() => onDeletePost(post)}
                              className="cursor-pointer"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : arePostsFetching || arePostsLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <DashboardSkeleton />
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="pt-4 lg:text-md text-center"
                    >
                      No posts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of{" "}
            <strong>{filteredPosts?.length}</strong> posts
          </div>
        </CardFooter>
      </Card>
    );
  }
);

PostsTabContent.displayName = "PostsTabContent";

export default PostsTabContent;
