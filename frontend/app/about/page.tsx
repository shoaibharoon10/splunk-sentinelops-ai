import React from "react";
import { Info, Shield, Server, Cpu, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-500" />
            <span>About Splunk SentinelOps AI</span>
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Project background, security architecture, and agent pipeline mechanics.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core details column */}
        <div className="md:col-span-2 space-y-6">
          {/* Project Tag */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-3">
            <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Project Mission</span>
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              **Splunk SentinelOps AI** is an AI-powered, human-in-the-loop security investigation assistant designed to streamline the incident response workflow. Built for the Splunk Agentic Ops Hackathon (Security Track), it automates root-cause logging investigations, computes explainable risk, and proposes mitigations while ensuring safety through mandatory manual analyst approvals.
            </p>
          </div>

          {/* Splunk Integration Info */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-3">
            <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-500" />
              <span>Splunk Log Analysis</span>
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              The application translates security events into context-aware Splunk queries (SPL) targeting active security log indices:
            </p>
            <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
              <li><code className="bg-zinc-900 px-1 py-0.5 rounded font-mono text-[10px] text-zinc-300">sentinelops:auth</code>: Pinpoints failed credentials logins and brute-force events.</li>
              <li><code className="bg-zinc-900 px-1 py-0.5 rounded font-mono text-[10px] text-zinc-300">sentinelops:endpoint</code>: Scans process logs and malicious cmd execution payloads.</li>
              <li><code className="bg-zinc-900 px-1 py-0.5 rounded font-mono text-[10px] text-zinc-300">sentinelops:firewall</code>: Monitors byte volume trends to detect data exfiltration.</li>
            </ul>
          </div>

          {/* AI Agents Info */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-3">
            <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>AI Agents Pipeline</span>
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              The backend uses 7 distinct security agents built with FastAPI and Pydantic:
            </p>
            <ol className="list-decimal pl-5 text-xs text-zinc-400 space-y-1">
              <li><strong>Alert Parser</strong>: Extracts key variables (IP, username, host).</li>
              <li><strong>SPL Planner</strong>: Forms targeted search parameters.</li>
              <li><strong>Evidence Collector</strong>: Executes searches against indices or local log seeds.</li>
              <li><strong>Risk Scorer</strong>: Evaluates factors and calculates score metrics.</li>
              <li><strong>Timeline Builder</strong>: Chronologically links activities into an attack story.</li>
              <li><strong>Recommender</strong>: Suggests response paths with action impact details.</li>
              <li><strong>Report Writer</strong>: Compiles markdown incident reports.</li>
            </ol>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
          {/* Submission Info */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-3">
            <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase border-b border-zinc-900 pb-2">
              Hackathon Details
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-zinc-900 py-1">
                <span className="text-zinc-500">Track</span>
                <span className="text-zinc-300 font-semibold">Security</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 py-1">
                <span className="text-zinc-500">Core Focus</span>
                <span className="text-zinc-300 font-semibold">Agentic Ops Triage</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 py-1">
                <span className="text-zinc-500">Bonus Target</span>
                <span className="text-zinc-300 font-semibold">Splunk MCP Server</span>
              </div>
            </div>
          </div>

          {/* HITL Safety */}
          <div className="bg-zinc-950 border border-zinc-850/50 rounded-lg p-5 space-y-3 bg-emerald-950/5 border-emerald-900/35">
            <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase border-b border-zinc-900/40 pb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Safety Model</span>
            </h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              To prevent issues with autonomous AI operations on production networks, SentinelOps AI enforces a strict manual validation model. AI agents can compile information, search logs, and draft mitigations, but **no remedial actions occur without an analyst explicitly clicking Approve**.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
