export interface Alert {
  alert_id: string;
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical" | string;
  source: string;
  user: string;
  host: string;
  source_ip: string;
  timestamp: string;
  status: "New" | "Investigating" | "Resolved" | string;
}

export interface InvestigationRequest {
  alert_id: string;
  use_mock_splunk?: boolean;
  use_mock_ai?: boolean;
}

export interface SPLQuery {
  description: string;
  query: string;
}

export interface EvidenceItem {
  source: string;
  description: string;
  raw_log: string;
}

export interface TimelineEvent {
  timestamp: string;
  source: string;
  event: string;
  severity: string;
  details: string;
}

export interface Recommendation {
  id: string;
  action: string;
  reason: string;
  impact: string;
  requires_approval: boolean;
  status: "pending" | "approved" | "rejected" | string;
}

export interface InvestigationResponse {
  alert_id: string;
  title: string;
  summary: string;
  generated_spl: SPLQuery[];
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  risk_score: number;
  risk_level: string;
  risk_factors: string[];
  recommendations: Recommendation[];
  human_approval_required: boolean;
  report_markdown: string;
  mode: string;
  splunk_status: string;
  ai_status: string;
  ai_mode: string;
  ai_provider_configured: boolean;
}

export interface SplunkStatus {
  connected: boolean;
  host: string;
  port: number;
  indices: Record<string, number>;
  error: string | null;
  mode?: string;
  configured?: boolean;
  index?: string;
  auth_method?: string;
  message?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  mode: string;
  version: string;
  splunk_connected: boolean;
  mcp_active: boolean;
  ai_provider: string;
  ai_mode: string;
  ai_provider_configured: boolean;
  timestamp: string;
}
