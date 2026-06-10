import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    text: string;
    type: "positive" | "negative" | "neutral";
  };
  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  className = "",
}: MetricCardProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between space-y-2 ${className}`}>
      <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
        {title}
      </span>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-zinc-100 tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              trend.type === "positive"
                ? "bg-emerald-950 text-emerald-400"
                : trend.type === "negative"
                ? "bg-red-950 text-red-400"
                : "bg-zinc-900 text-zinc-400"
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-zinc-400 text-xs truncate">{subtitle}</span>
      )}
    </div>
  );
}
