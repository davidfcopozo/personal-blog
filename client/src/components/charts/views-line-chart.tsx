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
import { useTranslations } from "next-intl";
import { generateViewsTimelineData } from "@/lib/analytics-utils";

interface ViewsLineChartProps {
  blogPosts: PostType[];
}

export default function ViewsLineChart({ blogPosts }: ViewsLineChartProps) {
  const tCharts = useTranslations("charts");

  const translateDay = (dayNumber: number) =>
    tCharts("dayWithNumber", { number: dayNumber });

  const data = generateViewsTimelineData(blogPosts, translateDay);

  const getTranslatedLabel = (key: string) => {
    switch (key) {
      case "views":
        return tCharts("views");
      case "day":
        return tCharts("day");
      default:
        return key;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="day" name={tCharts("day")} className="text-xs" />
        <YAxis name={tCharts("views")} className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value, name) => [value, getTranslatedLabel(String(name))]}
          labelFormatter={(label) => label}
        />
        <Line
          type="monotone"
          dataKey="views"
          name={tCharts("views")}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
