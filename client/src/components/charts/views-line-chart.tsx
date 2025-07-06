"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Day 1", views: 1200 },
  { day: "Day 2", views: 1350 },
  { day: "Day 3", views: 1100 },
  { day: "Day 4", views: 1800 },
  { day: "Day 5", views: 1600 },
  { day: "Day 6", views: 2100 },
  { day: "Day 7", views: 1900 },
  { day: "Day 8", views: 2300 },
  { day: "Day 9", views: 2000 },
  { day: "Day 10", views: 2400 },
  { day: "Day 11", views: 2200 },
  { day: "Day 12", views: 2600 },
  { day: "Day 13", views: 2300 },
  { day: "Day 14", views: 2800 },
  { day: "Day 15", views: 2500 },
  { day: "Day 16", views: 2900 },
  { day: "Day 17", views: 2700 },
  { day: "Day 18", views: 3100 },
  { day: "Day 19", views: 2800 },
  { day: "Day 20", views: 3200 },
  { day: "Day 21", views: 3000 },
  { day: "Day 22", views: 3400 },
  { day: "Day 23", views: 3100 },
  { day: "Day 24", views: 3500 },
  { day: "Day 25", views: 3300 },
  { day: "Day 26", views: 3600 },
  { day: "Day 27", views: 3400 },
  { day: "Day 28", views: 3700 },
  { day: "Day 29", views: 3500 },
  { day: "Day 30", views: 3800 },
];

export default function ViewsLineChart() {
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
