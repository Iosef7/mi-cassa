"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PALETTE = [
  "#6366f1", "#ef4444", "#93c5fd", "#a5b4fc", "#fca5a5",
  "#7c3aed", "#fbbf24", "#10b981", "#f97316", "#0ea5e9",
  "#ec4899", "#84cc16",
];

export type PieDatum = { name: string; value: number };

export function CategoryPieChart({
  data,
  valueFormatter,
}: {
  data: PieDatum[];
  valueFormatter?: (v: number) => string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            outerRadius={110}
            innerRadius={0}
            paddingAngle={1}
            dataKey="value"
            label={({ percent }) =>
              percent && percent > 0.03 ? `${(percent * 100).toFixed(1)}%` : ""
            }
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="#1a1a1a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
                borderRadius: 12, 
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "#1a1a1a",
                color: "#fff"
            }}
            formatter={(value) => [
              valueFormatter
                ? valueFormatter(Number(value))
                : Number(value).toLocaleString(),
              `${((Number(value) / total) * 100).toFixed(1)}%`,
            ]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, lineHeight: "20px", color: "#9ca3af" }}
            formatter={(value, entry) => {
              const datum = entry?.payload as unknown as PieDatum | undefined;
              return `${value} - ${datum?.value ?? ""}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
