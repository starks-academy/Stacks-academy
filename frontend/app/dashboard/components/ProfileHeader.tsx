"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useXp } from "@/hooks/useXp";
import XpProgressBar from "./XpProgressBar";
import RoleBadge from "@/app/components/RoleBadge";

function truncate(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export default function ProfileHeader() {
  const { user, isAuthenticated } = useAuth();
  const { stats } = useProfile();
  const { xpInfo, streak } = useXp();

  // Derive avatar initials
  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.walletAddress
    ? user.walletAddress.slice(0, 2).toUpperCase()
    : "SA";

  const displayName = user?.displayName || "Anonymous Builder";
  const walletAddress = user?.walletAddress || "";

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 border border-gray-800 bg-[#1A1A24]/50 backdrop-blur-sm">
      {/* Cover Image */}
      <div className="h-32 md:h-48 w-full bg-linear-to-r from-brand-orange/40 via-purple-500/30 to-blue-500/20" />

      <div className="px-6 sm:px-10 pb-8">
        <div className="relative flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-[#0A0B1A] border-4 border-[#1A1A24] flex items-center justify-center p-2 shadow-xl overflow-hidden">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-brand-orange to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                {/* Level badge */}
                {user && (
                  <span className="bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-bold px-2 py-0.5 rounded-full">
                    Level {user.level}
                  </span>
                )}
                {/* Role badge */}
                {user && <RoleBadge role={user.role} />}
              </div>

              {walletAddress && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 font-mono text-sm bg-black/40 px-2 py-1 rounded">
                    {truncate(walletAddress)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(walletAddress)}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Copy wallet address"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              )}

              {user?.bio && (
                <p className="text-gray-400 text-sm mt-1 max-w-md">{user.bio}</p>
              )}
            </div>
          </div>

          <div className="hidden sm:flex gap-3 pb-2">
            <Link href="/certificates" className="bg-brand-orange hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-brand-orange">
              My Certificates
            </Link>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10">
              Edit Profile
            </button>
          </div>
        </div>

        {/* XP Progress Bar */}
        {isAuthenticated && xpInfo && (
          <XpProgressBar xpInfo={xpInfo} />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/50">
          <div>
            <div className="text-gray-400 text-sm mb-1">Total XP</div>
            <div className="text-2xl font-bold text-white">
              {(stats?.xpTotal ?? user?.xpTotal ?? 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Current Level</div>
            <div className="text-2xl font-bold text-white">
              {stats?.level ?? user?.level ?? 1}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">🔥 Streak</div>
            <div className="text-2xl font-bold text-white">
              {streak?.streakDays ?? stats?.streakDays ?? 0}{" "}
              <span className="text-sm font-normal text-gray-400">days</span>
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Longest Streak</div>
            <div className="text-2xl font-bold text-brand-orange">
              {streak?.longestStreak ?? stats?.longestStreak ?? 0}{" "}
              <span className="text-sm font-normal text-gray-400">days</span>
            </div>
          </div>
        </div>

        {/* Unauthenticated nudge */}
        {!isAuthenticated && (
          <p className="text-gray-500 text-sm mt-4">
            Connect your Stacks wallet to see your profile and stats.
          </p>
        )}
      </div>
    </div>
  );
}
