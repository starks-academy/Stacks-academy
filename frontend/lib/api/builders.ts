import { request } from "@/lib/api/client";

export type BuilderCategory =
  | "Ecosystem"
  | "DeFi"
  | "NFTs"
  | "Tooling"
  | "Education"
  | "Infrastructure";

export interface BuilderProfile {
  id: string;
  userId: string;
  name: string;
  handle: string;
  role: string;
  description: string;
  category: BuilderCategory;
  moderationStatus: "pending" | "approved" | "rejected";
  twitterUrl?: string;
  websiteUrl?: string;
  createdAt: string;
}

export interface SubmitBuilderDto {
  name: string;
  handle: string;
  role: string;
  description: string;
  category: BuilderCategory;
  twitterUrl?: string;
  websiteUrl?: string;
}

export const buildersApi = {
  /** List all approved builder profiles (public, filterable by category) */
  getBuilders: (category?: BuilderCategory) => {
    const params = category ? `?category=${category}` : "";
    return request<BuilderProfile[]>(`/builders${params}`);
  },

  /** Get a single builder profile by ID */
  getBuilder: (id: string) => request<BuilderProfile>(`/builders/${id}`),

  /** Submit own builder profile for community review (requires auth) */
  submitProfile: (dto: SubmitBuilderDto) =>
    request<BuilderProfile>("/builders/submit", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  // ── Admin ──────────────────────────────────────────────────────────────────

  /** [ADMIN] List all pending builder profiles */
  getPending: () => request<BuilderProfile[]>("/builders/admin/pending"),

  /** [ADMIN] Approve a builder profile */
  approve: (id: string, notes?: string) =>
    request<BuilderProfile>(`/builders/admin/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    }),

  /** [ADMIN] Reject (delete) a builder profile */
  reject: (id: string, reason: string) =>
    request<{ deleted: boolean; reason: string }>(
      `/builders/admin/${id}/reject`,
      { method: "PATCH", body: JSON.stringify({ reason }) },
    ),
};
