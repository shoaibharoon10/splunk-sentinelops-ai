"use client";

import React, { useState, useEffect } from "react";
import { Settings, Shield, RefreshCw } from "lucide-react";
import { getHealth, getSplunkStatus } from "../../lib/api";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [apiBaseUrl, setApiBaseUrl] = useState(process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000");
  const [backendMode, setBackendMode] = useState("mock");
  const [aiMode, setAiMode] = useState("mock");
  const [splunkMode, setSplunkMode] = useState("mock");
  const [splunkServer, setSplunkServer] = useState("localhost:8089");
  const [indicesStatus, setIndicesStatus] = useState<Record<string, number>>({});

  const loadDiagnostics = async (isManual = false) => {
    if (isManual) {
      setLoading(true);
    }
    setApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000");
    try {
      const [health, splunk] = await Promise.all([getHealth(), getSplunkStatus()]);
      setBackendMode(health.mode);
      setAiMode(health.ai_provider);
      setSplunkMode(splunk.connected ? "Production REST API" : "Mock (CSV Fallback)");
      setSplunkServer(`${splunk.host}:${splunk.port}`);
      setIndicesStatus(splunk.indices || {});
    } catch (err) {
      console.error("Failed to load settings diagnostics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([getHealth(), getSplunkStatus()])
      .then(([health, splunk]) => {
        if (active) {
          setBackendMode(health.mode);
          setAiMode(health.ai_provider);
          setSplunkMode(splunk.connected ? "Production REST API" : "Mock (CSV Fallback)");
          setSplunkServer(`${splunk.host}:${splunk.port}`);
          setIndicesStatus(splunk.indices || {});
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load settings diagnostics:", err);
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            <span>Diagnostics & Settings</span>
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Active environment variables, connection properties, and database indexes diagnostics.
          </p>
        </div>
        <button
          onClick={() => loadDiagnostics(true)}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-semibold rounded text-xs border border-zinc-800 transition duration-150"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Reload</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment Profile */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
          <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase border-b border-zinc-900 pb-2 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-zinc-500" />
            <span>Environment Configuration</span>
          </h3>

          <div className="space-y-3 text-xs pt-1">
            <div className="flex flex-col space-y-1">
              <span className="text-zinc-500 font-semibold text-[10px] uppercase">NEXT_PUBLIC_API_BASE_URL</span>
              <span className="font-mono text-zinc-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-850 block w-full select-all">
                {apiBaseUrl}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-zinc-900">
              <span className="text-zinc-400 font-medium">Backend Application Mode</span>
              <span className="font-mono font-bold text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                {backendMode}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-zinc-900">
              <span className="text-zinc-400 font-medium">AI Agent Pipeline Provider</span>
              <span className="font-mono font-bold text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                {aiMode}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-zinc-400 font-medium">Splunk Integration Mode</span>
              <span className="font-mono font-bold text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                {splunkMode}
              </span>
            </div>
          </div>
        </div>

        {/* Splunk Diagnostics */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
          <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase border-b border-zinc-900 pb-2 flex items-center space-x-2">
            <Settings className="w-4 h-4 text-zinc-500" />
            <span>Splunk Ingestion Diagnostics</span>
          </h3>

          <div className="space-y-3 text-xs pt-1">
            <div className="flex flex-col space-y-1">
              <span className="text-zinc-500 font-semibold text-[10px] uppercase">Splunk REST Server Address</span>
              <span className="font-mono text-zinc-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-850 block w-full">
                {splunkServer}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-zinc-500 font-semibold text-[10px] uppercase block">
                Index Record Counts (Mock CSV Log Rows)
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-zinc-400">
                <div className="bg-zinc-900/40 p-2 rounded border border-zinc-900 flex justify-between">
                  <span className="text-zinc-500">auth_logs</span>
                  <span className="text-zinc-300 font-bold">{indicesStatus.auth_logs ?? 0}</span>
                </div>
                <div className="bg-zinc-900/40 p-2 rounded border border-zinc-900 flex justify-between">
                  <span className="text-zinc-500">endpoint_logs</span>
                  <span className="text-zinc-300 font-bold">{indicesStatus.endpoint_logs ?? 0}</span>
                </div>
                <div className="bg-zinc-900/40 p-2 rounded border border-zinc-900 flex justify-between">
                  <span className="text-zinc-500">firewall_logs</span>
                  <span className="text-zinc-300 font-bold">{indicesStatus.firewall_logs ?? 0}</span>
                </div>
                <div className="bg-zinc-900/40 p-2 rounded border border-zinc-900 flex justify-between">
                  <span className="text-zinc-500">web_logs</span>
                  <span className="text-zinc-300 font-bold">{indicesStatus.web_logs ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mocks Notification Info */}
      <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-5 text-xs text-zinc-400 space-y-2 leading-relaxed">
        <h4 className="text-zinc-300 font-bold uppercase text-[10px] tracking-wider">
          Triage Execution Safety Model
        </h4>
        <p>
          By default, Splunk SentinelOps AI runs in **Mock Triage Mode**. It loads local threat profile seeds from <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300">alerts.json</code> and parses seed synthetic logs from CSV datasets to simulate security actions without impacting production infrastructure.
        </p>
        <p>
          To configure production REST API parameters for Splunk Enterprise or active OpenAI/Gemini models, analysts can write credentials to <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300">backend/.env</code> using the configuration placeholders mapped in <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300">backend/.env.example</code>.
        </p>
      </div>
    </div>
  );
}
