/**
 * Typed API client for the Stacks Academy backend.
 * Base URL is configured via NEXT_PUBLIC_API_URL env var.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sa_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message || "API request failed");
  }

  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface ChallengeResponse {
  nonce: string;
  expiresAt: string;
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export const authApi = {
  challenge: (walletAddress: string) =>
    request<ChallengeResponse>("/auth/challenge", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    }),

  verify: (walletAddress: string, signature: string, publicKey: string) =>
    request<AuthResponse>("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ walletAddress, signature, publicKey }),
    }),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  walletAddress: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  xpTotal: number;
  level: number;
  streakDays: number;
  longestStreak: number;
  lastActivityAt: string | null;
  role: "user" | "admin";
  isPro: boolean;
}

export interface UserStats {
  xpTotal: number;
  level: number;
  streakDays: number;
  longestStreak: number;
  lastActivityAt: string | null;
}

export interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

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

// ─── Gamification ─────────────────────────────────────────────────────────────

export interface XpInfo {
  xpTotal: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number; // 0–1
}

export interface StreakInfo {
  streakDays: number;
  longestStreak: number;
  lastActivityAt: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  walletAddress: string;
  displayName: string | null;
  avatarUrl: string | null;
  xpTotal: number;
  level: number;
  streakDays: number;
}

export const gamificationApi = {
  getMyXp: () => request<XpInfo>("/gamification/me/xp"),
  getMyStreak: () => request<StreakInfo>("/gamification/me/streak"),
  getLeaderboard: (page = 1, limit = 10) =>
    request<{ data: LeaderboardEntry[]; meta: object }>(
      `/gamification/leaderboard?page=${page}&limit=${limit}`
    ),
  getMyBadges: () => request<object[]>("/gamification/me/badges"),
  getAllBadges: () => request<object[]>("/gamification/badges"),
};
