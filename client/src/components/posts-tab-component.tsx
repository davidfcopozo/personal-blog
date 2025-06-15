"use client";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
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
        const aValue = a[sortConfig.key as keyof PostType];
        const bValue = b[sortConfig.key as keyof PostType];

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort("title")}
                  className="cursor-pointer"
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
                  className="cursor-pointer"
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
                  onClick={() => handleSort("likes")}
                  className="hidden md:table-cell cursor-pointer"
                >
                  <SortIndicator
                    title="Likes"
                    direction={sortConfig?.direction}
                    size={12}
                    strokeWidth={3}
                    isActive={sortConfig?.key === "likes"}
                  />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("comments")}
                  className="hidden md:table-cell cursor-pointer"
                >
                  <SortIndicator
                    title="Comments"
                    direction={sortConfig?.direction}
                    size={12}
                    strokeWidth={3}
                    isActive={sortConfig?.key === "comments"}
                  />
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Categories
                </TableHead>
                <TableHead
                  onClick={() => handleSort("visits")}
                  className="hidden md:table-cell cursor-pointer"
                >
                  <SortIndicator
                    title="Visits"
                    direction={sortConfig?.direction}
                    size={12}
                    strokeWidth={3}
                    isActive={sortConfig?.key === "visits"}
                  />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("createdAt")}
                  className="hidden md:table-cell cursor-pointer"
                >
                  <SortIndicator
                    title="Date"
                    direction={sortConfig?.direction}
                    size={12}
                    strokeWidth={3}
                    isActive={sortConfig?.key === "date"}
                  />
                </TableHead>
                <TableHead>
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
                    </TableCell>{" "}
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {post?.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {post?.likes?.length}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {post?.comments?.length}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {post?.categories?.map((category: CategoryType) => (
                        <span key={category._id.toString()}>
                          {category.name}
                          {(post?.categories?.length ?? 0) - 1 !==
                          post?.categories?.indexOf(category)
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {post?.visits}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {showMonthDayYear(post?.createdAt?.toString() || "")}
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
                    colSpan={8}
                    className="pt-4 lg:text-md text-center"
                  >
                    No posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
