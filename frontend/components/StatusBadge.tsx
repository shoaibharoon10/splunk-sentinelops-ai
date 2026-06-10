import React from "react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const norm = status.toLowerCase().trim();

  // Severity Colors
  if (norm === "critical") {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-950/80 text-red-400 border border-red-800 ${className}`}>
        Critical
      </span>
    );
  }
  if (norm === "high") {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-950/80 text-orange-400 border border-orange-800 ${className}`}>
        High
      </span>
    );
  }
  if (norm === "medium") {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-950/80 text-yellow-400 border border-yellow-800 ${className}`}>
        Medium
      </span>
    );
  }
  if (norm === "low") {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800 ${className}`}>
        Low
      </span>
    );
  }

  // Connection/Triage status Colors
  if (norm === "connected" || norm === "healthy" || norm === "online" || norm === "approved") {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 ${className}`}>
        {status}
      </span>
    );
  }

  if (norm === "offline" || norm === "disconnected" || norm === "rejected" || norm === "offline (mock mode)") {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950/50 text-red-400 border border-red-500/30 ${className}`}>
        {status}
      </span>
    );
  }

  if (norm === "pending" || norm === "investigating" || norm === "triage") {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-900 text-amber-400 border border-amber-500/30 ${className}`}>
        {status}
      </span>
    );
  }

  // Default Fallback
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 ${className}`}>
      {status}
    </span>
  );
}
