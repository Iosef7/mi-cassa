"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SalesChart({ data }: { data?: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-gray-400 text-sm italic">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRentals" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + "k" : value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              color: "#fff",
              fontSize: "12px",
            }}
            itemStyle={{ fontSize: "12px", padding: "2px 0" }}
            formatter={(value, name) => [
              `$${Number(value).toLocaleString()}`, 
              name === "salesValue" ? "Ventas" : "Alquileres"
            ]}
            labelStyle={{ color: "#9ca3af", marginBottom: "8px", fontWeight: "bold" }}
            cursor={{ stroke: "rgba(255, 255, 255, 0.1)", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="salesValue"
            name="salesValue"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="rentalsValue"
            name="rentalsValue"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRentals)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
