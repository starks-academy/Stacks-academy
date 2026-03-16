import { request } from "@/lib/api/client";
import type { LeaderboardEntry, StreakInfo, XpInfo } from "@/lib/api/types";

export interface XpEvent {
  id: string;
  amount: number;
  reason: string;
  referenceId?: string;
  createdAt: string;
}

export const gamificationApi = {
  getMyXp: () => request<XpInfo>("/gamification/me/xp"),

  getMyStreak: () => request<StreakInfo>("/gamification/me/streak"),

  getLeaderboard: (page = 1, limit = 10) =>
    request<{ data: LeaderboardEntry[]; meta: object }>(
      `/gamification/leaderboard?page=${page}&limit=${limit}`,
    ),

  getMyBadges: () => request<object[]>("/gamification/me/badges"),

  getAllBadges: () => request<object[]>("/gamification/badges"),

  getMyActivity: (page = 1, limit = 20) =>
    request<{ data: XpEvent[]; meta: object }>(
      `/gamification/me/activity?page=${page}&limit=${limit}`,
    ),
};
