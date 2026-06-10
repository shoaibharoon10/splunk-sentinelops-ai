"use client";

import React, { useState } from "react";

interface SPLQueryProps {
  description: string;
  query: string;
}

export default function SPLQueryBlock({ description, query }: SPLQueryProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
      <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          {/* Splunk logo-style accent */}
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          <span className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            Splunk Search Query
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-emerald-500 hover:text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20 hover:border-emerald-500/40 transition duration-150 font-medium"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-zinc-400 text-xs leading-relaxed italic border-l-2 border-emerald-500 pl-3">
          {description}
        </p>
        <div className="bg-zinc-900/50 rounded p-3 border border-zinc-900 font-mono text-xs text-pink-400 overflow-x-auto whitespace-pre leading-relaxed select-all">
          {query}
        </div>
      </div>
    </div>
  );
}
