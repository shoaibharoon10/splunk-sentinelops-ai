"use client";

import React, { useState } from "react";
import { Recommendation } from "../lib/types";
import { updateRecommendation } from "../lib/api";
import StatusBadge from "./StatusBadge";

interface RecommendationPanelProps {
  alertId: string;
  recommendations: Recommendation[];
  onActionTriggered?: () => void;
}

export default function RecommendationPanel({
  alertId,
  recommendations: initialRecommendations,
  onActionTriggered,
}: RecommendationPanelProps) {
  const [recs, setRecs] = useState<Recommendation[]>(initialRecommendations);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (recId: string, actionStatus: "approved" | "rejected") => {
    setProcessingId(recId);
    setErrorMsg(null);
    try {
      // API call to update recommendation
      await updateRecommendation(alertId, recId, actionStatus);
      
      // Update local state
      setRecs((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, status: actionStatus } : r))
      );

      // Trigger refresh if parent has registered callback
      if (onActionTriggered) {
        onActionTriggered();
      }
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(`Failed to execute action on backend: ${errMsg}. Mock status updated locally.`);
      
      // Fallback: update local state anyway so the demo is safe and functional
      setRecs((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, status: actionStatus } : r))
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase">
          Human-in-the-Loop Response Panel
        </h3>
        <span className="text-[10px] text-amber-500 font-medium px-2 py-0.5 bg-amber-950/20 rounded border border-amber-500/20">
          HITL Active
        </span>
      </div>

      {errorMsg && (
        <div className="bg-red-950/25 border border-red-500/25 rounded p-3 text-red-400 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        {recs.map((rec) => (
          <div
            key={rec.id}
            className="border border-zinc-850 bg-zinc-950 p-4 rounded-lg space-y-3 hover:border-zinc-850/80 transition duration-150"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-2">
              <span className="text-zinc-200 text-xs font-semibold font-mono">
                {rec.action}
              </span>
              <div className="flex items-center space-x-2">
                {rec.requires_approval && rec.status === "pending" && (
                  <span className="text-[9px] font-bold text-red-400 px-1.5 py-0.5 bg-red-950/40 rounded border border-red-500/30">
                    Analyst Approval Required
                  </span>
                )}
                <StatusBadge status={rec.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Triage Reason</span>
                <span className="text-zinc-400 leading-relaxed">{rec.reason}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Projected Impact</span>
                <span className="text-zinc-400 leading-relaxed">{rec.impact}</span>
              </div>
            </div>

            {rec.status === "pending" && (
              <div className="flex items-center space-x-2 pt-2 justify-end border-t border-zinc-900">
                <button
                  disabled={processingId !== null}
                  onClick={() => handleAction(rec.id, "rejected")}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-semibold rounded text-xs border border-zinc-800 transition duration-150 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  disabled={processingId !== null}
                  onClick={() => handleAction(rec.id, "approved")}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs border border-emerald-700 shadow-md shadow-emerald-950/50 transition duration-150 disabled:opacity-50"
                >
                  {processingId === rec.id ? "Processing..." : "Approve & Execute"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Safety warnings footer */}
      <div className="bg-zinc-900/40 border border-zinc-900 rounded p-3 text-[10px] text-zinc-500 leading-relaxed italic">
        ⚠️ <strong>Security Safety Notice:</strong> All response actions are simulated. No real users, IP addresses, system files, or firewalls are modified on the network.
      </div>
    </div>
  );
}
