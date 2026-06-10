"use client";

import React, { useState } from "react";
import { EvidenceItem } from "../lib/types";

interface EvidenceCardProps {
  evidence: EvidenceItem;
}

export default function EvidenceCard({ evidence }: EvidenceCardProps) {
  const [showRaw, setShowRaw] = useState(false);

  // Determine Badge styling based on index source
  const getBadgeStyle = (src: string) => {
    const s = src.toLowerCase();
    if (s.includes("auth")) {
      return "bg-indigo-950/60 text-indigo-400 border-indigo-800";
    }
    if (s.includes("endpoint") || s.includes("sysmon") || s.includes("process")) {
      return "bg-amber-950/60 text-amber-400 border-amber-800";
    }
    if (s.includes("firewall") || s.includes("network")) {
      return "bg-cyan-950/60 text-cyan-400 border-cyan-800";
    }
    return "bg-zinc-900 text-zinc-400 border-zinc-700";
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${getBadgeStyle(
              evidence.source
            )}`}
          >
            {evidence.source}
          </span>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 underline font-mono focus:outline-none"
          >
            {showRaw ? "Hide Raw" : "Show Raw Log"}
          </button>
        </div>
        <p className="text-zinc-300 text-xs font-medium leading-relaxed">
          {evidence.description}
        </p>
      </div>

      {showRaw && (
        <div className="bg-zinc-900/80 rounded p-2 border border-zinc-850 font-mono text-[10px] text-zinc-400 overflow-x-auto whitespace-pre-wrap select-all leading-normal max-h-40">
          {evidence.raw_log}
        </div>
      )}
    </div>
  );
}
