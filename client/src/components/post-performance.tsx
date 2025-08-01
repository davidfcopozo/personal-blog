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
import Link from "next/link";
import TopPostsBarChart from "@/components/charts/top-posts-bar-chart";
import { PostType } from "@/typings/types";
import { DateRange } from "react-day-picker";
import { calculateReadingTime, showMonthDayYear } from "@/utils/formats";
import { useLocale, useTranslations } from "next-intl";
import { es } from "date-fns/locale";

interface PostPerformanceProps {
  blogPosts: PostType[];
}
export function PostPerformance({ blogPosts }: PostPerformanceProps) {
  const locale = useLocale();
  const tPostPerformance = useTranslations("postPerformance");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("views");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const dateLocale = locale === "es" ? es : undefined;

  const totalViews = blogPosts.reduce(
    (sum, post) => sum + (post.visits || 0),
    0
  );
  const totalLikes = blogPosts.reduce(
    (sum, post) => sum + (post.likesCount || 0),
    0
  );
  const totalBookmarks = blogPosts.reduce(
    (sum, post) => sum + (post.bookmarksCount || 0),
    0
  );
  const totalComments = blogPosts.reduce(
    (sum, post) => sum + (post.comments?.length || 0),
    0
  );
  const totalShares = blogPosts.reduce(
    (sum, post) => sum + (post.sharesCount || 0),
    0
  );

  const calculatePercentageChange = (
    currentTotal: number,
    posts: PostType[],
    metricType: "views" | "likes" | "bookmarks" | "comments" | "shares"
  ) => {
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const postsExistingLastMonth = posts.filter(
      (post) => new Date(post.createdAt || new Date()) <= lastMonth
    );

    if (postsExistingLastMonth.length === 0) {
      return currentTotal > 0 ? 100 : null;
    }

    let lastMonthTotal = 0;
    switch (metricType) {
      case "views":
        lastMonthTotal = postsExistingLastMonth.reduce(
          (sum, post) => sum + (post.visits || 0),
          0
        );
        break;
      case "likes":
        lastMonthTotal = postsExistingLastMonth.reduce(
          (sum, post) => sum + (post.likesCount || 0),
          0
        );
        break;
      case "bookmarks":
        lastMonthTotal = postsExistingLastMonth.reduce(
          (sum, post) => sum + (post.bookmarksCount || 0),
          0
        );
        break;
      case "comments":
        lastMonthTotal = postsExistingLastMonth.reduce(
          (sum, post) => sum + (post.comments?.length || 0),
          0
        );
        break;
      case "shares":
        lastMonthTotal = postsExistingLastMonth.reduce(
          (sum, post) => sum + (post.sharesCount || 0),
          0
        );
        break;
    }

    if (lastMonthTotal === 0) {
      return currentTotal > 0 ? 100 : 0;
    }

    const change = ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return Math.round(change * 10) / 10;
  };

  const viewsChange = calculatePercentageChange(totalViews, blogPosts, "views");
  const likesChange = calculatePercentageChange(totalLikes, blogPosts, "likes");
  const bookmarksChange = calculatePercentageChange(
    totalBookmarks,
    blogPosts,
    "bookmarks"
  );
  const commentsChange = calculatePercentageChange(
    totalComments,
    blogPosts,
    "comments"
  );
  const sharesChange = calculatePercentageChange(
    totalShares,
    blogPosts,
    "shares"
  );

  const formatPercentageChange = (change: number | null) => {
    if (change === null) {
      return { sign: "", value: "N/A", colorClass: "text-muted-foreground" };
    }

    const sign = change >= 0 ? "+" : "";
    const colorClass = change >= 0 ? "text-green-600" : "text-red-500";
    return { sign, value: Math.abs(change), colorClass };
  };

  const getChangeText = (change: number | null) => {
    if (change === null || formatPercentageChange(change).value === "N/A") {
      return tPostPerformance("noHistoricalData");
    }
    return tPostPerformance("fromLastMonth");
  };

  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        post.categories?.some((cat) => cat.name === categoryFilter);

      // Date range filter
      const matchesDateRange = (() => {
        if (!dateRange?.from) return true;

        const postDate = new Date(post.createdAt || new Date());
        const fromDate = new Date(dateRange.from);
        const toDate = dateRange.to ? new Date(dateRange.to) : new Date();

        // Set time to start/end of day for accurate comparison
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        return postDate >= fromDate && postDate <= toDate;
      })();

      return matchesSearch && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return (b.visits || 0) - (a.visits || 0);
        case "likes":
          return (b.likesCount || 0) - (a.likesCount || 0);
        case "bookmarks":
          return (b.bookmarksCount || 0) - (a.bookmarksCount || 0);
        case "comments":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        case "date":
          return (
            new Date(b.createdAt || new Date()).getTime() -
            new Date(a.createdAt || new Date()).getTime()
          );
        default:
          return 0;
      }
    });

  const allCategories = blogPosts
    .flatMap((post) => post.categories || [])
    .map((cat) => String(cat.name))
    .filter((name, index, array) => array.indexOf(name) === index);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tPostPerformance("totalViews")}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={formatPercentageChange(viewsChange).colorClass}>
                {formatPercentageChange(viewsChange).value === "N/A"
                  ? "N/A"
                  : `${formatPercentageChange(viewsChange).sign}${
                      formatPercentageChange(viewsChange).value
                    }%`}
              </span>{" "}
              {getChangeText(viewsChange)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tPostPerformance("totalLikes")}
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLikes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={formatPercentageChange(likesChange).colorClass}>
                {formatPercentageChange(likesChange).value === "N/A"
                  ? "N/A"
                  : `${formatPercentageChange(likesChange).sign}${
                      formatPercentageChange(likesChange).value
                    }%`}
              </span>{" "}
              {getChangeText(likesChange)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tPostPerformance("bookmarks")}
            </CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground stroke-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBookmarks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={formatPercentageChange(bookmarksChange).colorClass}
              >
                {formatPercentageChange(bookmarksChange).value === "N/A"
                  ? "N/A"
                  : `${formatPercentageChange(bookmarksChange).sign}${
                      formatPercentageChange(bookmarksChange).value
                    }%`}
              </span>{" "}
              {getChangeText(bookmarksChange)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tPostPerformance("comments")}
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalComments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={formatPercentageChange(commentsChange).colorClass}
              >
                {formatPercentageChange(commentsChange).value === "N/A"
                  ? "N/A"
                  : `${formatPercentageChange(commentsChange).sign}${
                      formatPercentageChange(commentsChange).value
                    }%`}
              </span>{" "}
              {getChangeText(commentsChange)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tPostPerformance("shares")}
            </CardTitle>
            <Share2 className="h-4 w-4 text-[#0072f5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalShares.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={formatPercentageChange(sharesChange).colorClass}>
                {formatPercentageChange(sharesChange).value === "N/A"
                  ? "N/A"
                  : `${formatPercentageChange(sharesChange).sign}${
                      formatPercentageChange(sharesChange).value
                    }%`}
              </span>{" "}
              {getChangeText(sharesChange)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{tPostPerformance("topPerformingPosts")}</CardTitle>
          <CardDescription>
            {tPostPerformance("topPerformingPostsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopPostsBarChart blogPosts={blogPosts} />
        </CardContent>
      </Card>

      {/* Detailed Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>{tPostPerformance("postPerformanceDetails")}</CardTitle>
          <CardDescription>
            {tPostPerformance("postPerformanceDetailsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder={tPostPerformance("searchPosts")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={tPostPerformance("allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {tPostPerformance("allCategories")}
                </SelectItem>
                {allCategories.map((category: string) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={tPostPerformance("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">
                  {tPostPerformance("sortByViews")}
                </SelectItem>
                <SelectItem value="likes">
                  {tPostPerformance("sortByLikes")}
                </SelectItem>
                <SelectItem value="bookmarks">
                  {tPostPerformance("sortByBookmarks")}
                </SelectItem>
                <SelectItem value="comments">
                  {tPostPerformance("sortByComments")}
                </SelectItem>
                <SelectItem value="date">
                  {tPostPerformance("sortByDate")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] sm:w-[280px] justify-start text-left font-normal bg-transparent min-w-0"
                >
                  <CalendarDays className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {showMonthDayYear(
                            dateRange.from.toISOString(),
                            locale as "en" | "es"
                          )}{" "}
                          -{" "}
                          {showMonthDayYear(
                            dateRange.to.toISOString(),
                            locale as "en" | "es"
                          )}
                        </>
                      ) : (
                        showMonthDayYear(
                          dateRange.from.toISOString(),
                          locale as "en" | "es"
                        )
                      )
                    ) : (
                      <span>{tPostPerformance("pickDateRange")}</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={dateLocale}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Posts Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px]">
                    {tPostPerformance("post")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {tPostPerformance("category")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {tPostPerformance("published")}
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    {tPostPerformance("sortByViews")}
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    {tPostPerformance("sortByLikes")}
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    {tPostPerformance("sortByBookmarks")}
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    {tPostPerformance("sortByComments")}
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    {tPostPerformance("shares")}
                  </TableHead>
                  <TableHead className="text-right min-w-[120px]">
                    {tPostPerformance("engagement")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => {
                  const engagementRate =
                    (((post.likesCount || 0) +
                      (post.comments?.length || 0) +
                      (post.sharesCount || 0)) /
                      Math.max(post.visits || 1, 1)) *
                    100;
                  return (
                    <TableRow key={post._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <Link
                            href={`/${post.postedBy?.username || "user"}/${
                              post.slug || post._id
                            }`}
                            className="font-medium hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {calculateReadingTime(
                              post.content || "",
                              locale as "en" | "es"
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {post.categories?.slice(0, 2).map((cat, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-6 py-2 sm:px-3"
                            >
                              {String(cat.name)}
                            </Badge>
                          ))}
                          {(post.categories?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(post.categories?.length || 0) - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {showMonthDayYear(
                          post.createdAt || new Date().toISOString(),
                          locale as "en" | "es"
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(post.visits || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {(post.likesCount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {(post.bookmarksCount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {(post.comments?.length || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {(post.sharesCount || 0).toLocaleString()}
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
