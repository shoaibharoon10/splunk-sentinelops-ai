"use client";

import React, { useState } from "react";
import { exportReport } from "../lib/api";

interface ReportPreviewProps {
  alertId: string;
  reportMarkdown: string;
}

export default function ReportPreview({ alertId, reportMarkdown }: ReportPreviewProps) {
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloading(true);
    setErrorMsg(null);
    try {
      // API call to verify/get the export
      const res = await exportReport(alertId, reportMarkdown);
      const markdownContent = res.report_markdown || reportMarkdown;

      // Create browser download
      const blob = new Blob([markdownContent], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Splunk_SentinelOps_Report_${alertId}.md`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(`Failed to export report: ${errMsg}. Triggering local fallback download.`);
      
      // Fallback local download
      const blob = new Blob([reportMarkdown], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Splunk_SentinelOps_Report_${alertId}_local.md`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase">
            Executive Incident Report
          </h3>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs border border-emerald-700 shadow-md transition duration-150 disabled:opacity-50"
        >
          {downloading ? "Exporting..." : "Export Markdown Report"}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-yellow-950/20 border border-yellow-500/30 rounded p-2 text-yellow-400 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Markdown text representation container */}
      <div className="bg-zinc-900/60 rounded border border-zinc-850 p-4 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed select-all overflow-y-auto max-h-[500px] shadow-inner">
        {reportMarkdown}
      </div>
    </div>
  );
}
