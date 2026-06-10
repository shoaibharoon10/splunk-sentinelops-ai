"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ShieldAlert, RefreshCw, Eye } from "lucide-react";
import { getAlerts } from "../../lib/api";
import { Alert } from "../../lib/types";
import StatusBadge from "../../components/StatusBadge";
import LoadingState from "../../components/LoadingState";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAlerts = async (isManual = false) => {
    if (isManual) {
      setLoading(true);
      setErrorMsg(null);
    }
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Failed to retrieve security alerts queue.";
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getAlerts()
      .then((data) => {
        if (active) {
          setAlerts(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const errMsg = err instanceof Error ? err.message : "Failed to retrieve security alerts queue.";
          setErrorMsg(errMsg);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-500" />
            <span>Active Alerts Queue</span>
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Pending security alerts requiring triage and investigation pipelines.
          </p>
        </div>
        <button
          onClick={() => fetchAlerts(true)}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold rounded text-xs border border-zinc-800 transition duration-150"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3 text-red-400 text-xs">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block uppercase tracking-wide">Queue Retrieval Failure</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState type="skeleton-list" message="Loading alerts database..." />
      ) : alerts.length === 0 ? (
        <div className="p-12 text-center border border-zinc-800 bg-zinc-950 rounded-lg space-y-2">
          <AlertCircle className="w-8 h-8 text-zinc-650 mx-auto" />
          <h3 className="text-zinc-300 text-sm font-semibold">Triage Queue Empty</h3>
          <p className="text-zinc-500 text-xs max-w-xs mx-auto">
            No active threat alerts were found in the queue. New events will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-850 text-zinc-400 font-semibold uppercase tracking-wider text-[10px] select-none">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Triage Status</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Alert Title</th>
                  <th className="py-3.5 px-4">Host</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Source IP</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {alerts.map((alert) => {
                  const dateStr = new Date(alert.timestamp).toLocaleString();
                  return (
                    <tr
                      key={alert.alert_id}
                      className="hover:bg-zinc-900/30 transition duration-150"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-zinc-400">
                        {alert.alert_id}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[10px] uppercase text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={alert.severity} />
                      </td>
                      <td className="py-4 px-4 font-medium text-zinc-200">
                        {alert.title}
                      </td>
                      <td className="py-4 px-4 font-mono text-zinc-400">
                        {alert.host || "N/A"}
                      </td>
                      <td className="py-4 px-4 font-mono text-zinc-400">
                        {alert.user || "N/A"}
                      </td>
                      <td className="py-4 px-4 font-mono text-zinc-400">
                        {alert.source_ip || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-zinc-500 font-mono">
                        {dateStr}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/alerts/${alert.alert_id}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-500 hover:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded transition duration-150"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="font-semibold">Triage Workspace</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
