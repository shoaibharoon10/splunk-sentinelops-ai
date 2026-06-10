import {
  Alert,
  InvestigationResponse,
  SplunkStatus,
  HealthResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// Helper to handle fetch responses and throw structured error messages
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Server error: ${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      if (data && data.detail) {
        errorMessage = data.detail;
      }
    } catch {
      // Ignore json parse error and use default status message
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

// Catch network connection errors (e.g. backend offline)
async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    return await handleResponse<T>(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (err instanceof TypeError && message.includes("fetch")) {
      throw new Error(
        "Backend offline. Cannot connect to Splunk SentinelOps AI service at " + BASE_URL
      );
    }
    throw err;
  }
}

export async function getHealth(): Promise<HealthResponse> {
  return safeFetch<HealthResponse>(`${BASE_URL}/health`);
}

export async function getAlerts(): Promise<Alert[]> {
  return safeFetch<Alert[]>(`${BASE_URL}/alerts`);
}

export async function getAlert(alertId: string): Promise<Alert> {
  return safeFetch<Alert>(`${BASE_URL}/alerts/${alertId}`);
}

export async function investigateAlert(alertId: string): Promise<InvestigationResponse> {
  return safeFetch<InvestigationResponse>(`${BASE_URL}/investigate`, {
    method: "POST",
    body: JSON.stringify({
      alert_id: alertId,
      use_mock_splunk: true,
      use_mock_ai: true,
    }),
  });
}

export async function exportReport(
  alertId: string
): Promise<{ report_markdown: string }> {
  return safeFetch<{ report_markdown: string }>(`${BASE_URL}/export-report`, {
    method: "POST",
    body: JSON.stringify({
      alert_id: alertId,
    }),
  });
}

export async function getSplunkStatus(): Promise<SplunkStatus> {
  return safeFetch<SplunkStatus>(`${BASE_URL}/splunk/status`);
}

export async function updateRecommendation(
  alertId: string,
  recommendationId: string,
  status: "approved" | "rejected"
): Promise<{ alert_id: string; recommendation_id: string; status: string }> {
  return safeFetch<{ alert_id: string; recommendation_id: string; status: string }>(
    `${BASE_URL}/alerts/${alertId}/actions/${recommendationId}`,
    {
      method: "POST",
      body: JSON.stringify({ status }),
    }
  );
}
