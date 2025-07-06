"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PostType } from "@/typings/types";

interface TopPostsBarChartProps {
  blogPosts: PostType[];
}

export default function TopPostsBarChart({ blogPosts }: TopPostsBarChartProps) {
  // Transform real post data into chart data, taking top 5 posts by views
  const data = blogPosts
    .sort((a, b) => (b.visits || 0) - (a.visits || 0))
    .slice(0, 5)
    .map((post) => ({
      name:
        post.title.length > 20
          ? post.title.substring(0, 20) + "..."
          : post.title,
      Views: post.visits || 0,
    }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          className="text-xs"
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Bar
          dataKey="Views"
          fill="hsl(var(--thread-border))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
