"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Day 1", likes: 45, comments: 12, shares: 8 },
  { day: "Day 2", likes: 52, comments: 15, shares: 10 },
  { day: "Day 3", likes: 38, comments: 9, shares: 6 },
  { day: "Day 4", likes: 67, comments: 18, shares: 12 },
  { day: "Day 5", likes: 59, comments: 16, shares: 11 },
  { day: "Day 6", likes: 78, comments: 22, shares: 15 },
  { day: "Day 7", likes: 71, comments: 19, shares: 13 },
  { day: "Day 8", likes: 89, comments: 25, shares: 17 },
  { day: "Day 9", likes: 82, comments: 23, shares: 16 },
  { day: "Day 10", likes: 95, comments: 28, shares: 19 },
  { day: "Day 11", likes: 88, comments: 26, shares: 18 },
  { day: "Day 12", likes: 103, comments: 31, shares: 21 },
  { day: "Day 13", likes: 96, comments: 29, shares: 20 },
  { day: "Day 14", likes: 112, comments: 34, shares: 23 },
  { day: "Day 15", likes: 105, comments: 32, shares: 22 },
];

export default function EngagementAreaChart() {
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
