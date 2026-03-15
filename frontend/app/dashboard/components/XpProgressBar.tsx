"use client";

import { XpInfo } from "@/lib/api";

interface XpProgressBarProps {
  xpInfo: XpInfo;
}

export default function XpProgressBar({ xpInfo }: XpProgressBarProps) {
  const { xpTotal, level, currentLevelXp, nextLevelXp, progress } = xpInfo;
  const pct = Math.min(Math.round(progress * 100), 100);
  const xpIntoLevel = xpTotal - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-400 font-medium">
          Level {level} → Level {level + 1}
        </span>
        <span className="text-xs text-gray-400 font-mono">
          {xpIntoLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-orange to-amber-400 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-[10px] text-gray-500 mt-1">{pct}% to next level</p>
    </div>
  );
}
