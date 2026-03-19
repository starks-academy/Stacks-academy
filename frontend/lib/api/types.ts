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

export interface XpInfo {
  xpTotal: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number;
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