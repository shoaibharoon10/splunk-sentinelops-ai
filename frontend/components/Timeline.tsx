import React from "react";
import { TimelineEvent } from "../lib/types";

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  // Sort events chronologically by timestamp
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getSeverityColor = (sev: string) => {
    const s = sev.toLowerCase();
    if (s.includes("critical") || s.includes("high")) return "bg-red-500 border-red-800 shadow-red-500/50";
    if (s.includes("medium") || s.includes("warning")) return "bg-amber-500 border-amber-800 shadow-amber-500/50";
    return "bg-emerald-500 border-emerald-800 shadow-emerald-500/50";
  };

  if (!sortedEvents || sortedEvents.length === 0) {
    return (
      <div className="p-6 text-center text-zinc-500 text-xs border border-zinc-800 bg-zinc-950 rounded-lg">
        No attack timeline events available.
      </div>
    );
  }

  return (
    <div className="relative border-l border-zinc-800 ml-4 pl-6 space-y-6 py-2">
      {sortedEvents.map((evt, idx) => {
        const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        return (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 shadow-sm ${getSeverityColor(
                evt.severity
              )}`}
            ></div>

            {/* Content Card */}
            <div className="bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded-lg p-4 space-y-2 transition duration-150">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>{timeStr}</span>
                <span className="uppercase tracking-wider px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-[9px]">
                  {evt.source}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-zinc-200 font-medium text-xs tracking-wide">
                  {evt.event}
                </h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {evt.details}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
