import React from "react";
import Link from "next/link";
import { Alert } from "../lib/types";
import StatusBadge from "./StatusBadge";

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  // Format Date
  const dateStr = new Date(alert.timestamp).toLocaleString();

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition duration-150 flex flex-col justify-between h-full space-y-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <StatusBadge status={alert.severity} />
          <span className="text-zinc-500 text-xs">{alert.alert_id}</span>
        </div>
        <h3 className="text-zinc-100 font-medium text-sm line-clamp-2 leading-relaxed">
          {alert.title}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 border-t border-zinc-900 pt-3">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Target User</span>
          <span className="truncate block text-zinc-300 font-mono">{alert.user || "N/A"}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Target Host</span>
          <span className="truncate block text-zinc-300 font-mono">{alert.host || "N/A"}</span>
        </div>
        <div className="col-span-2 pt-1">
          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Source IP</span>
          <span className="block text-zinc-300 font-mono">{alert.source_ip || "N/A"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
        <span className="text-zinc-500 text-[10px] font-mono">{dateStr}</span>
        <Link
          href={`/alerts/${alert.alert_id}`}
          className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 bg-emerald-950/20 px-3 py-1 rounded border border-emerald-500/20 hover:border-emerald-500/40 transition duration-150"
        >
          Investigate
        </Link>
      </div>
    </div>
  );
}
