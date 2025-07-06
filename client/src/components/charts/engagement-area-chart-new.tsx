"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PostType } from "@/typings/types";
import { generateEngagementTimelineData } from "@/lib/analytics-utils";

interface EngagementAreaChartProps {
  blogPosts: PostType[];
}

export default function EngagementAreaChart({
  blogPosts,
}: EngagementAreaChartProps) {
  const data = generateEngagementTimelineData(blogPosts);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="day" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Area
          type="monotone"
          dataKey="likes"
          stackId="1"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.8}
        />
        <Area
          type="monotone"
          dataKey="comments"
          stackId="1"
          stroke="hsl(var(--secondary))"
          fill="hsl(var(--secondary))"
          fillOpacity={0.8}
        />
        <Area
          type="monotone"
          dataKey="shares"
          stackId="1"
          stroke="hsl(var(--muted-foreground))"
          fill="hsl(var(--muted-foreground))"
          fillOpacity={0.8}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
