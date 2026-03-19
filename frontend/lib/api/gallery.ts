import { request } from "@/lib/api/client";

export interface GalleryProject {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  liveUrl?: string;
  category: string;
  tags: string[];
  moderationStatus: string;
  upvotes: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  repoUrl: string;
  liveUrl?: string;
  category: string;
  tags?: string[];
}

export const galleryApi = {
  getAll: (page = 1, limit = 10, category?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });
    return request<{ data: GalleryProject[]; meta: object }>(
      `/gallery?${params}`,
    );
  },

  getOne: (id: string) => request<GalleryProject>(`/gallery/${id}`),

  create: (dto: CreateProjectDto) =>
    request<GalleryProject>("/gallery", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  update: (id: string, dto: Partial<CreateProjectDto>) =>
    request<GalleryProject>(`/gallery/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    }),

  delete: (id: string) => request<void>(`/gallery/${id}`, { method: "DELETE" }),

  vote: (id: string) =>
    request<{ upvoted: boolean }>(`/gallery/${id}/vote`, { method: "POST" }),

  // ── Admin ──────────────────────────────────────────────────────────────────

  /** [ADMIN] List all pending gallery projects */
  getPending: (page = 1, limit = 50) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return request<{ data: GalleryProject[]; meta: object }>(
      `/gallery/admin/pending?${params}`,
    );
  },

  /** [ADMIN] Approve a project */
  approveProject: (id: string, notes?: string) =>
    request<GalleryProject>(`/gallery/admin/${id}/moderate`, {
      method: "PATCH",
      body: JSON.stringify({ status: "approved", notes }),
    }),

  /** [ADMIN] Reject a project */
  rejectProject: (id: string, notes?: string) =>
    request<GalleryProject>(`/gallery/admin/${id}/moderate`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected", notes }),
    }),
};
