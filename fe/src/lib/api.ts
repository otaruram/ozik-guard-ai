import { supabase } from "./supabase";

const API_BASE = import.meta.env.DEV ? "http://localhost:10000/api/v1" : "https://otaruchain.my.id/api/v1";

async function getAuthHeaders(isFormData = false): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {};
  
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const headers = await getAuthHeaders(isFormData);
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// --- API Functions ---

export const api = {
  // User
  getMe: () => apiFetch<any>("/user/me"),
  updateMe: (data: { name: string; company?: string }) =>
    apiFetch<any>("/user/me", { method: "PUT", body: JSON.stringify(data) }),
  regenerateApiKey: () => apiFetch<any>("/user/api-key/regenerate", { method: "POST" }),

  // Audit
  getHistory: () => apiFetch<{ audits: any[]; totalCount: number }>("/audit/history"),
  getAuditDetail: (id: string) => apiFetch<any>(`/audit/${id}`),
  processFullAudit: (data: FormData) =>
    apiFetch<any>("/audit/full-process", { method: "POST", body: data }),

  // Guest Teaser (No Auth)
  guestTeaser: (data: FormData) =>
    fetch(`${API_BASE}/audit/guest-teaser`, {
      method: "POST",
      body: data,
    }).then((r) => r.json()),

  // Public Verify
  verifyBadge: (hash: string) =>
    fetch(`${API_BASE}/verify/${hash}`).then((r) => r.json()),
};
