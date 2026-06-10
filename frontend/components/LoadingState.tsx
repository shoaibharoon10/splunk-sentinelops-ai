import React from "react";

interface LoadingStateProps {
  message?: string;
  type?: "spinner" | "pipeline" | "skeleton-list" | "skeleton-detail";
}

export default function LoadingState({
  message = "Loading...",
  type = "spinner",
}: LoadingStateProps) {
  if (type === "pipeline") {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-emerald-500 font-semibold tracking-wide uppercase text-sm animate-pulse">
            Executing Agentic Pipeline
          </h3>
          <p className="text-zinc-400 text-xs tracking-wide">{message}</p>
        </div>
        <div className="w-full max-w-xs bg-zinc-900 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-2/3 rounded-full animate-[pulse_1.5s_infinite]"></div>
        </div>
      </div>
    );
  }

  if (type === "skeleton-list") {
    return (
      <div className="space-y-3 w-full">
        <div className="h-10 bg-zinc-900 border border-zinc-800 rounded animate-pulse w-full"></div>
        <div className="h-14 bg-zinc-900/50 border border-zinc-800/50 rounded animate-pulse w-full"></div>
        <div className="h-14 bg-zinc-900/50 border border-zinc-800/50 rounded animate-pulse w-full"></div>
        <div className="h-14 bg-zinc-900/50 border border-zinc-800/50 rounded animate-pulse w-full"></div>
      </div>
    );
  }

  if (type === "skeleton-detail") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="md:col-span-2 space-y-6">
          <div className="h-32 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse"></div>
          <div className="h-96 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 space-x-3">
      <div className="w-5 h-5 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
      <span className="text-zinc-400 text-sm">{message}</span>
    </div>
  );
}
