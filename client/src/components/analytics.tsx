"use client";

import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewsLineChart from "@/components/charts/views-line-chart";
import EngagementAreaChart from "@/components/charts/engagement-area-chart";
import { blogPosts } from "@/lib/mock-blog-posts";

export function Analytics() {
  // Calculate total metrics
  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = blogPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = blogPosts.reduce((sum, post) => sum + post.comments, 0);
  const totalShares = blogPosts.reduce((sum, post) => sum + post.shares, 0);

  const categories = [...new Set(blogPosts.map((post) => post.category))];

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
                <CardDescription>
                  Daily page views for the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ViewsLineChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  Likes, comments, and shares over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EngagementAreaChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  Likes, comments, and shares over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EngagementAreaChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate by Category</CardTitle>
                <CardDescription>
                  Average engagement per post category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const categoryPosts = blogPosts.filter(
                      (post) => post.category === category
                    );
                    const avgEngagement =
                      categoryPosts.reduce(
                        (sum, post) =>
                          sum + post.likes + post.comments + post.shares,
                        0
                      ) / categoryPosts.length;
                    const maxEngagement = Math.max(
                      ...categories.map((cat) => {
                        const posts = blogPosts.filter(
                          (post) => post.category === cat
                        );
                        return (
                          posts.reduce(
                            (sum, post) =>
                              sum + post.likes + post.comments + post.shares,
                            0
                          ) / posts.length
                        );
                      })
                    );
                    const percentage = (avgEngagement / maxEngagement) * 100;

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>{Math.round(avgEngagement)}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {(
                      ((totalLikes + totalComments + totalShares) /
                        totalViews) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Engagement Rate
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(totalViews / blogPosts.length).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Views per Post
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {categories.find((cat) => {
                      const posts = blogPosts.filter(
                        (post) => post.category === cat
                      );
                      return (
                        posts.reduce((sum, post) => sum + post.views, 0) ===
                        Math.max(
                          ...categories.map((c) =>
                            blogPosts
                              .filter((p) => p.category === c)
                              .reduce((s, p) => s + p.views, 0)
                          )
                        )
                      );
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Top Performing Category
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Views Trend Analysis</CardTitle>
              <CardDescription>
                Track your blog&apos;s view performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ViewsLineChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
