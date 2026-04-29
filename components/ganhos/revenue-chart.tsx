"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { formatBRL } from "@/lib/format";
import type { MonthlyRevenue } from "@/lib/types";

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <Tooltip
          formatter={(v) => formatBRL(Number(v))}
          cursor={{ fill: "transparent" }}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            color: "var(--foreground)",
          }}
        />
        <Bar
          dataKey="revenue"
          fill="var(--primary)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
