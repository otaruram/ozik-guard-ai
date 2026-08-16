import { supabase } from "./supabase";

const API_BASE = import.meta.env.DEV ? "http://localhost:10000/api/v1" : "https://ozikgrid.web.id/api/v1";

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
  updateNotifications: (data: { notifyReportDone: boolean; notifyRegulation: boolean }) =>
    apiFetch<any>("/user/me/notifications", { method: "PUT", body: JSON.stringify(data) }),
  regenerateApiKey: () => apiFetch<any>("/user/api-key/regenerate", { method: "POST" }),

  // Audit
  getHistory: () => apiFetch<{ audits: any[]; totalCount: number }>("/audit/history"),
  getAuditDetail: (id: string) => apiFetch<any>(`/audit/${id}`),
  deleteAudit: (id: string) => apiFetch<void>(`/audit/${id}`, { method: "DELETE" }),
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

  // Admin
  adminGetAllUsers: () => apiFetch<{ users: any[] }>("/admin/users"),
  adminUpdateCredits: (id: string, credits: number) =>
    apiFetch<any>(`/admin/users/${id}/credits`, { method: "PUT", body: JSON.stringify({ credits }) }),
  adminToggleBan: (id: string, isBanned: boolean) =>
    apiFetch<any>(`/admin/users/${id}/ban`, { method: "PUT", body: JSON.stringify({ isBanned }) }),
  adminUpdateRole: (id: string, role: string) =>
    apiFetch<any>(`/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
  adminGetUserHistory: (id: string) => apiFetch<{ history: any[] }>(`/admin/users/${id}/history`),
};
