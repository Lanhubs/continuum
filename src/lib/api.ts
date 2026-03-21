import type { MedicalRecord, ScanStatus, TrendPoint } from "../types/medical";

// Using relative path to leverage Vite's proxy (see vite.config.ts)
const API_BASE = "/api";

export const medicalApi = {
  async getHistory(): Promise<MedicalRecord[]> {
    const res = await fetch(`${API_BASE}/history`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
  },

  async getTrends(markerName: string): Promise<{ marker_name: string; trends: TrendPoint[] }> {
    const res = await fetch(`${API_BASE}/trends/${markerName}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch trends");
    return res.json();
  },

  async interpret(file: File, type: string = 'LAB_RESULT'): Promise<{ scan_id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const endpoint = type === 'PRESCRIPTION' ? '/interpret/prescription' : 
                     type === 'LAB_RESULT' ? '/interpret/lab' : 
                     type === 'RADIOLOGY' ? '/interpret/radiology' :
                     '/interpret';

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      body: formData,
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to start interpretation");
    return res.json();
  },

  async getPrescriptions(): Promise<MedicalRecord[]> {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch prescriptions");
    return res.json();
  },

  async getScanStatus(scanId: string): Promise<ScanStatus> {
    const res = await fetch(`${API_BASE}/status/${scanId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch scan status");
    return res.json();
  },

  async sendChat(message: string, sessionId?: string, file?: File, type?: string): Promise<{ reply: string; session_id: string }> {
    const formData = new FormData();
    formData.append("message", message);
    if (sessionId) formData.append("session_id", sessionId);
    if (file) formData.append("image", file);
    if (type) formData.append("type", type);

    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      body: formData,
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to send chat message");
    return res.json();
  },

  async getRecentDocuments(limit = 5): Promise<{ id: string; type: string; date: string; summary_message: string; overall_stability: number }[]> {
    const res = await fetch(`${API_BASE}/documents/recent?limit=${limit}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch recent documents");
    return res.json();
  }
};
