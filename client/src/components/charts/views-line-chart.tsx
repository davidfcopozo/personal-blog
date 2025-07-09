"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PostType } from "@/typings/types";
import { generateViewsTimelineData } from "@/lib/analytics-utils";

interface ViewsLineChartProps {
  blogPosts: PostType[];
}

export default function ViewsLineChart({ blogPosts }: ViewsLineChartProps) {
  const data = generateViewsTimelineData(blogPosts);

  const formatTooltipLabel = (label: string) => {
    // Capitalize first letter of each word
    return label.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
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
          formatter={(value, name) => [value, formatTooltipLabel(String(name))]}
        />
        <Line
          type="monotone"
          dataKey="views"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
