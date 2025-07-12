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
import { useTranslations } from "next-intl";

interface EngagementAreaChartProps {
  blogPosts: PostType[];
}

export default function EngagementAreaChart({
  blogPosts,
}: EngagementAreaChartProps) {
  const tCharts = useTranslations("charts");

  const translateDay = (dayNumber: number) =>
    tCharts("dayWithNumber", { number: dayNumber });

  const data = generateEngagementTimelineData(blogPosts, translateDay);

  const getTranslatedLabel = (key: string) => {
    switch (key) {
      case "likes":
        return tCharts("likes");
      case "comments":
        return tCharts("comments");
      case "bookmarks":
        return tCharts("bookmarks");
      case "shares":
        return tCharts("shares");
      case "day":
        return tCharts("day");
      default:
        return key;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="day" name={tCharts("day")} className="text-xs" />
        <YAxis name={tCharts("likes")} className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value, name) => [value, getTranslatedLabel(String(name))]}
          labelFormatter={(label) => label}
        />
        <Area
          type="monotone"
          dataKey="likes"
          name={tCharts("likes")}
          stackId="1"
          stroke="#ec4899"
          fill="#ec4899"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="comments"
          name={tCharts("comments")}
          stackId="1"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="bookmarks"
          name={tCharts("bookmarks")}
          stackId="1"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="shares"
          name={tCharts("shares")}
          stackId="1"
          stroke="#0072f5"
          fill="#0072f5"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
