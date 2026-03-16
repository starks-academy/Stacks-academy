import { request } from "./client";
import type { UpdateProfileDto, UserProfile, UserStats } from "./types";

export const usersApi = {
  getMe: () => request<UserProfile>("/users/me"),

  updateMe: (dto: UpdateProfileDto) =>
    request<UserProfile>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(dto),
    }),

  getById: (id: string) => request<UserProfile>(`/users/${id}`),

  getStats: (id: string) => request<UserStats>(`/users/${id}/stats`),
};