"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Cpu,
  AlertCircle,
  PlayCircle,
  Database,
  Terminal,
} from "lucide-react";
import { getAlert, investigateAlert } from "../../../lib/api";
import { Alert, InvestigationResponse } from "../../../lib/types";
import StatusBadge from "../../../components/StatusBadge";
import LoadingState from "../../../components/LoadingState";
import SPLQueryBlock from "../../../components/SPLQueryBlock";
import EvidenceCard from "../../../components/EvidenceCard";
import Timeline from "../../../components/Timeline";
import RiskScore from "../../../components/RiskScore";
import RecommendationPanel from "../../../components/RecommendationPanel";
import ReportPreview from "../../../components/ReportPreview";

export default function InvestigationPage() {
  const params = useParams();
  const router = useRouter();
  const alertId = params.alertId as string;

  const [alert, setAlert] = useState<Alert | null>(null);
  const [investigation, setInvestigation] = useState<InvestigationResponse | null>(null);
  
  const [loadingAlert, setLoadingAlert] = useState(true);
  const [investigating, setInvestigating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load basic alert metadata
  useEffect(() => {
    async function fetchAlertMetadata() {
      setLoadingAlert(true);
      setErrorMsg(null);
      try {
        const data = await getAlert(alertId);
        setAlert(data);
      } catch (err: unknown) {
        console.error(err);
        const errMsg = err instanceof Error ? err.message : `Failed to fetch metadata for alert ${alertId}.`;
        setErrorMsg(errMsg);
      } finally {
        setLoadingAlert(false);
      }
    }
    if (alertId) {
      fetchAlertMetadata();
    }
  }, [alertId]);

  // Execute Agentic Pipeline
  const handleInvestigate = async () => {
    setInvestigating(true);
    setErrorMsg(null);
    try {
      const data = await investigateAlert(alertId);
      setInvestigation(data);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "An error occurred during AI agent pipeline execution.";
      setErrorMsg(errMsg);
    } finally {
      setInvestigating(false);
    }
  };

  if (loadingAlert) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <LoadingState type="skeleton-list" message="Loading threat profile metadata..." />
      </div>
    );
  }

  if (errorMsg && !investigation) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4">
        <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-6 flex items-start space-x-3 text-red-400">
          <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider">Triage Triage Error</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">{errorMsg}</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/alerts")}
          className="flex items-center space-x-2 text-xs text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Alerts Queue</span>
        </button>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-zinc-650 mx-auto" />
        <h3 className="text-zinc-300 font-semibold text-sm">Alert Profile Not Found</h3>
        <button
          onClick={() => router.push("/alerts")}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 hover:bg-zinc-800 transition duration-150"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  // Pre-investigation landing page
  if (!investigation && !investigating) {
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => router.push("/alerts")}
          className="flex items-center space-x-2 text-xs text-zinc-400 hover:text-zinc-200 transition duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Alert Queue</span>
        </button>

        {/* Alert Metadata Profile Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <StatusBadge status={alert.severity} />
                <span className="text-[10px] text-zinc-500 font-mono font-bold">
                  {alert.alert_id}
                </span>
              </div>
              <h2 className="text-md font-bold text-zinc-100">{alert.title}</h2>
            </div>
            <span className="text-zinc-500 text-[10px] font-mono">
              Ingested: {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-zinc-900/30 border border-zinc-900 p-3 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase font-bold">Target Host</span>
              <span className="text-zinc-300 font-semibold font-mono">{alert.host || "N/A"}</span>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-900 p-3 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase font-bold">Target User</span>
              <span className="text-zinc-300 font-semibold font-mono">{alert.user || "N/A"}</span>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-900 p-3 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase font-bold">Source IP</span>
              <span className="text-zinc-300 font-semibold font-mono">{alert.source_ip || "N/A"}</span>
            </div>
          </div>

          {/* Trigger investigate console */}
          <div className="bg-zinc-900/40 border border-zinc-900/50 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 max-w-lg">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>SentinelOps AI Investigation Pipeline</span>
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Clicking the button will initiate the 7 sequential security agents. The agents will parse context, formulate logs searches (SPL), retrieve events, execute risk scoring, order the timeline, map remediations, and generate an executive markdown report.
              </p>
            </div>
            <button
              onClick={handleInvestigate}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs border border-emerald-700 shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/10 transition duration-150"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Investigate with AI</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (investigating) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <LoadingState
          type="pipeline"
          message="Executing Parser, Planner, Collector, Scorer, Timeline, Recommender, and Report agents..."
        />
      </div>
    );
  }

  // Render pipeline details once loaded
  if (investigation) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setInvestigation(null);
                setErrorMsg(null);
              }}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-850 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition duration-150"
              title="Reset Triage"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <StatusBadge status={alert.severity} />
                <span className="text-[10px] text-zinc-500 font-mono font-bold">
                  {investigation.alert_id}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {investigation.splunk_status}
                </span>
              </div>
              <h2 className="text-md font-bold text-zinc-100">{investigation.title}</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-zinc-400">
              Live Splunk REST Evidence
            </span>
            <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-zinc-400">
              {investigation.ai_status}
            </span>
            {investigation.human_approval_required && (
              <span className="px-2 py-1 bg-amber-950/30 rounded border border-amber-900/50 text-amber-500 font-bold">
                Human Approval Required
              </span>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Triage Left Column (66%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Summary / Incident Explanation */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-3">
              <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>AI Agent Triage Summary</span>
              </h3>
              <p className="text-zinc-300 text-xs leading-relaxed bg-zinc-900/40 p-3 rounded border border-zinc-900/60 font-medium">
                {investigation.summary}
              </p>
            </div>

            {/* Attack Timeline Nodes */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
              <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase flex items-center space-x-1.5">
                <PlayCircle className="w-4 h-4 text-emerald-500" />
                <span>Attack Timeline Chronology</span>
              </h3>
              <Timeline events={investigation.timeline} />
            </div>

            {/* Generated SPL queries */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
              <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Generated Log Searches (SPL)</span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {investigation.generated_spl.map((q, idx) => (
                  <SPLQueryBlock key={idx} description={q.description} query={q.query} />
                ))}
              </div>
            </div>

            {/* Evidence Cards */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
              <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>Ingested Log Evidence</span>
              </h3>
              {investigation.evidence && investigation.evidence.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {investigation.evidence.map((ev, idx) => (
                    <EvidenceCard key={idx} evidence={ev} />
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-xs italic p-4 text-center border border-zinc-900 bg-zinc-950/30 rounded-lg">
                  No log evidence was ingested for this threat scenario.
                </p>
              )}
            </div>

            {/* Markdown Report Preview & Export */}
            <ReportPreview alertId={alertId} reportMarkdown={investigation.report_markdown} />
          </div>

          {/* Diagnostics Right Column (33%) */}
          <div className="space-y-6">
            {/* Risk Gauge Card */}
            <RiskScore
              score={investigation.risk_score}
              level={investigation.risk_level}
              factors={investigation.risk_factors}
            />

            {/* HITL Recommendation approvals Panel */}
            <RecommendationPanel
              alertId={alertId}
              recommendations={investigation.recommendations}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
