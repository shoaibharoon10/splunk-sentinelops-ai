"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertOctagon,
  Settings,
  HelpCircle,
  Activity,
  Server,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { getHealth, getSplunkStatus } from "../lib/api";
import StatusBadge from "./StatusBadge";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [splunkOnline, setSplunkOnline] = useState<boolean | null>(null);
  const [aiProvider, setAiProvider] = useState<string>("Mock AI");
  const [loading, setLoading] = useState<boolean>(true);

  const checkStatuses = async (isManual = false) => {
    if (isManual) {
      setLoading(true);
    }
    try {
      const health = await getHealth();
      setBackendOnline(health.status === "healthy");
      setAiProvider(health.ai_provider || "Mock AI");
    } catch {
      setBackendOnline(false);
    }

    try {
      const splunk = await getSplunkStatus();
      setSplunkOnline(splunk.connected);
    } catch {
      setSplunkOnline(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const runCheck = () => {
      Promise.all([getHealth(), getSplunkStatus()])
        .then(([health, splunk]) => {
          if (active) {
            setBackendOnline(health.status === "healthy");
            setAiProvider(health.ai_provider || "Mock AI");
            setSplunkOnline(splunk.connected);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) {
            setBackendOnline(false);
            setSplunkOnline(false);
            setLoading(false);
          }
        });
    };

    runCheck();
    // Poll every 30 seconds for health changes
    const interval = setInterval(runCheck, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Alert Queue", href: "/alerts", icon: AlertOctagon },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About", href: "/about", icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between flex-shrink-0">
        <div className="flex flex-col flex-grow">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <span className="text-white font-extrabold text-sm tracking-tighter">SO</span>
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-zinc-100">
                SentinelOps AI
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium tracking-wide">
                Splunk SOC Triage Assistant
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition duration-150 ${
                    isActive
                      ? "bg-zinc-800 text-emerald-400 border border-zinc-700/50"
                      : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Diagnostics Panel at Bottom */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              Diagnostics
            </span>
            <button
              onClick={() => checkStatuses(true)}
              disabled={loading}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded focus:outline-none disabled:opacity-30"
              title="Refresh connection status"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Backend connection status */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-mono text-[10px] flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-zinc-500" />
                <span>API Endpoint</span>
              </span>
              <StatusBadge
                status={
                  backendOnline === null
                    ? "Checking"
                    : backendOnline
                    ? "Online"
                    : "Offline"
                }
              />
            </div>

            {/* Splunk connection status */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-mono text-[10px] flex items-center space-x-1.5">
                <Server className="w-3.5 h-3.5 text-zinc-500" />
                <span>Splunk index</span>
              </span>
              <StatusBadge
                status={
                  splunkOnline === null
                    ? "Checking"
                    : splunkOnline
                    ? "Connected"
                    : "Mock Mode"
                }
              />
            </div>

            {/* AI Engine status */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-mono text-[10px] flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                <span>AI Engine</span>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                {aiProvider}
              </span>
            </div>
          </div>

          {/* Safety disclaimer widget */}
          <div className="text-[9px] text-zinc-500 font-mono border-t border-zinc-800/60 pt-2 text-center select-none leading-relaxed">
            Hackathon Mock Integration Active
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header/Utility bar */}
        <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex-shrink-0 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-zinc-400 font-semibold font-mono bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
              Environment: Mock-Mode Core
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-400 font-mono font-medium">Splunk Ready</span>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <div className="flex-1 p-8">
          {backendOnline === false ? (
            <div className="max-w-2xl mx-auto my-12 bg-red-950/20 border border-red-500/30 rounded-lg p-6 space-y-4 shadow-xl">
              <div className="flex items-start space-x-3">
                <AlertOctagon className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="text-red-400 font-bold text-sm uppercase tracking-wide">
                    FastAPI Service Connection Failed
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    The frontend application is unable to establish a connection to the Splunk SentinelOps AI backend at <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-red-300 font-mono">http://127.0.0.1:8000</code>.
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/50 rounded p-4 text-xs space-y-2 text-zinc-400 border border-zinc-850">
                <span className="font-semibold block text-[10px] uppercase tracking-wider text-zinc-300">
                  How to start the backend:
                </span>
                <ol className="list-decimal pl-4 font-mono text-[11px] text-zinc-400 space-y-1">
                  <li>Navigate to the project root directory in your terminal.</li>
                  <li>Run: <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-200">cd backend</code></li>
                  <li>Run: <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-200">uvicorn app.main:app --reload</code></li>
                </ol>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => checkStatuses(true)}
                  disabled={loading}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded text-xs border border-zinc-750 transition duration-150 disabled:opacity-50"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
