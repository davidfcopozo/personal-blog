"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Eye,
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import TopPostsBarChart from "@/components/charts/top-posts-bar-chart";
import { blogPosts } from "@/lib/mock-blog-posts";
import { DateRange } from "react-day-picker";

export function PostPerformance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("views");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Calculate total metrics
  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = blogPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalBookmarks = blogPosts.reduce(
    (sum, post) => sum + post.bookmarks,
    0
  );
  const totalComments = blogPosts.reduce((sum, post) => sum + post.comments, 0);
  const totalShares = blogPosts.reduce((sum, post) => sum + post.shares, 0);

  // Filter and sort posts
  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || post.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        case "bookmarks":
          return b.bookmarks - a.bookmarks;
        case "comments":
          return b.comments - a.comments;
        case "date":
          return (
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
          );
        default:
          return 0;
      }
    });

  const categories = [...new Set(blogPosts.map((post) => post.category))];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLikes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBookmarks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalComments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+6.7%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalShares.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+9.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Posts ranked by total views</CardDescription>
        </CardHeader>
        <CardContent>
          <TopPostsBarChart />
        </CardContent>
      </Card>

      {/* Detailed Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Post Performance Details</CardTitle>
          <CardDescription>
            Detailed metrics for all your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="bookmarks">Bookmarks</SelectItem>
                <SelectItem value="comments">Comments</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal bg-transparent"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Posts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Bookmarks</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => {
                  const engagementRate =
                    ((post.likes + post.comments + post.shares) / post.views) *
                    100;
                  return (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{post.title}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(post.publishDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {post.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {post.likes.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {post.bookmarks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {post.comments.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {post.shares.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            engagementRate > 5
                              ? "default"
                              : engagementRate > 2
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {engagementRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
