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
          stroke="#ec4899"
          fill="#ec4899"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="comments"
          stackId="1"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="bookmarks"
          stackId="1"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="shares"
          stackId="1"
          stroke="#0072f5"
          fill="#0072f5"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
