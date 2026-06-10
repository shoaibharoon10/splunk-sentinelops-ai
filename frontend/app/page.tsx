"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Cpu,
  ArrowRight,
  Activity,
  PlayCircle,
} from "lucide-react";
import { getHealth, getAlerts, getSplunkStatus } from "../lib/api";
import { Alert } from "../lib/types";
import MetricCard from "../components/MetricCard";

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [splunkMode, setSplunkMode] = useState<string>("Mock Mode");
  const [aiMode, setAiMode] = useState<string>("Mock AI");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [alertsData, healthData, splunkData] = await Promise.all([
          getAlerts(),
          getHealth(),
          getSplunkStatus(),
        ]);
        setAlerts(alertsData);
        setSplunkMode(splunkData.connected ? "Splunk Connected (REST API)" : "Mock Mode (CSV Logs)");
        setAiMode(healthData.ai_provider || "Mock AI Pipeline");
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute stats
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity.toLowerCase() === "critical").length;
  const highAlerts = alerts.filter((a) => a.severity.toLowerCase() === "high").length;
  const mediumAlerts = alerts.filter((a) => a.severity.toLowerCase() === "medium").length;
  const lowAlerts = alerts.filter((a) => a.severity.toLowerCase() === "low").length;
  const investigationsReady = alerts.filter((a) => a.status.toLowerCase() === "new").length;

  const workflowSteps = [
    { name: "Alert Ingestion", desc: "Security alert triggers parser mapping target user, host, IP." },
    { name: "SPL Planner", desc: "Agent formulates searches around alert timestamp." },
    { name: "Evidence Collector", desc: "Retrieves process, login, and traffic logs." },
    { name: "Risk Assessment", desc: "Calculates threat scores and compiles risk factors." },
    { name: "Incident Timeline", desc: "Orders logs chronologically to reconstruct threat story." },
    { name: "HITL Remediation", desc: "Analyst approves or rejects simulated response actions." },
    { name: "Executive Report", desc: "Compiles incident timeline and evidence into Markdown." },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-500" />
            <span>Splunk SentinelOps AI</span>
          </h2>
          <p className="text-xs text-zinc-400 font-medium tracking-wide">
            Agentic Security Operations Center Investigation & Response Assistant
          </p>
        </div>
        <div>
          <Link
            href="/alerts"
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs border border-emerald-700 shadow-lg shadow-emerald-950/40 transition duration-150"
          >
            <span>Open Alert Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Alerts"
          value={loading ? "..." : totalAlerts}
          subtitle="Triage database queue"
        />
        <MetricCard
          title="Critical Threats"
          value={loading ? "..." : criticalAlerts}
          subtitle="Immediate response active"
          trend={{ text: `${criticalAlerts} Active`, type: criticalAlerts > 0 ? "negative" : "neutral" }}
        />
        <MetricCard
          title="Triage Needed"
          value={loading ? "..." : investigationsReady}
          subtitle="New alerts requiring AI triage"
        />
        <MetricCard
          title="Splunk Connection"
          value={loading ? "..." : splunkMode.includes("REST") ? "REST Active" : "Mock Mode"}
          subtitle={loading ? "Checking status" : splunkMode}
        />
        <MetricCard
          title="AI Pipeline Status"
          value={loading ? "..." : aiMode.includes("Mock") ? "Mock Mode" : "LLM API Active"}
          subtitle={loading ? "Determining gateway" : `Gateway: ${aiMode}`}
        />
      </div>

      {/* Severities Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Severity Queue Breakdown */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
          <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase border-b border-zinc-900 pb-2 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-zinc-500" />
            <span>Alert Queue Classification</span>
          </h3>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Critical severity alerts</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-red-950 text-red-400 border border-red-900">
                {loading ? "..." : criticalAlerts}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">High severity alerts</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-orange-950 text-orange-400 border border-orange-900">
                {loading ? "..." : highAlerts}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Medium severity alerts</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-yellow-950 text-yellow-400 border border-yellow-900">
                {loading ? "..." : mediumAlerts}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Low severity alerts</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-900">
                {loading ? "..." : lowAlerts}
              </span>
            </div>
          </div>
        </div>

        {/* Workflow Overview Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 md:col-span-2 space-y-4">
          <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase border-b border-zinc-900 pb-2 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-zinc-500" />
            <span>SentinelOps Agentic Triage Pipeline</span>
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            The SentinelOps assistant coordinates 7 specialized security AI agents sequentially to conduct root-cause investigation. The agents parsed raw threats, draft targeted search scopes (SPL), collect evidence from Splunk, compile timelines, compute risk metrics, request HITL approvals, and export executive incident write-ups.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="border border-zinc-900 bg-zinc-900/30 p-3 rounded space-y-1">
              <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider block">
                Pluggable Splunk Interface
              </span>
              <span className="text-zinc-400 text-xs leading-normal block">
                Runs search queries against Splunk indices or falls back dynamically to demodata CSV logs.
              </span>
            </div>
            <div className="border border-zinc-900 bg-zinc-900/30 p-3 rounded space-y-1">
              <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider block">
                Human-in-the-Loop Safe Triage
              </span>
              <span className="text-zinc-400 text-xs leading-normal block">
                All response actions require manual analyst validation in the UI dashboard before marking execute.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Workflow Timeline */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-6">
        <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase border-b border-zinc-900 pb-2 flex items-center space-x-2">
          <PlayCircle className="w-4 h-4 text-zinc-500" />
          <span>Pipeline Stepper Workflow</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="relative bg-zinc-900/30 border border-zinc-900 p-4 rounded-lg space-y-2 flex flex-col justify-between hover:border-zinc-850 transition duration-150">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-zinc-850 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                    {idx + 1}
                  </span>
                  {idx < 6 && (
                    <ArrowRight className="w-3 h-3 text-zinc-700 hidden lg:block" />
                  )}
                </div>
                <h4 className="text-zinc-300 font-semibold text-xs tracking-wide pt-1">
                  {step.name}
                </h4>
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
