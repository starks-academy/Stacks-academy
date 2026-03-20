"use client";

import React, { useEffect, useState } from "react";
import { User, Trophy, Zap } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useXp } from "@/hooks/useXp";
import { coursesApi } from "@/lib/api/courses";
import { certificatesApi } from "@/lib/api/certificates";

export default function HeroProgressWidget() {
  const { user, isAuthenticated } = useAuth();
  const { xpInfo } = useXp();
  const [completedModules, setCompletedModules] = useState(0);
  const [totalModules, setTotalModules] = useState(7);
  const [nftCount, setNftCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    coursesApi
      .getProgressSummary()
      .then((summary) => {
        setTotalModules(summary.totalCourses);
        setCompletedModules(summary.completedCourses);
      })
      .catch(() => {});

    certificatesApi
      .getMyCerts()
      .then((certs) => {
        setNftCount(certs.filter((c) => !!c.txId).length);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const journeyPercentage = xpInfo?.progress
    ? Math.min(Math.round(xpInfo.progress * 100), 100)
    : 0;

  const completedPercentage =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const displayName = user?.displayName || "Anonymous Builder";

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 relative z-10">
      <div className="bg-[#14152C] rounded-2xl p-6 md:p-8 border border-[#2A2B4A] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Progress Indicator */}
          <div className="flex items-center gap-6 flex-1 w-full">
            <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 flex items-center justify-center rounded-full border-[3px] border-[#2A2B4A]">
              <svg
                className="absolute w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="transparent"
                  stroke="#2A2B4A"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="transparent"
                  stroke="#F58320"
                  strokeWidth="8"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * journeyPercentage) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="text-xl md:text-2xl font-bold text-white">
                {journeyPercentage}%
              </span>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h2 className="text-white font-semibold text-lg md:text-xl">
                    Course Journey
                  </h2>
                  <p className="text-[#8E90B0] text-sm">
                    {completedPercentage}% completed
                  </p>
                </div>
              </div>

              <div className="h-2 w-full bg-[#0A0B1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#F58320] to-[#FFB067] rounded-full"
                  style={{ width: `${completedPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-[#8E90B0]">
                <span>{completedModules} Modules</span>
                <span>{totalModules} Modules</span>
              </div>
            </div>
          </div>

          {/* User Profile Mini */}
          <div className="flex items-center gap-4 bg-[#0A0B1A]/50 p-4 rounded-xl border border-[#2A2B4A]/50 shrink-0 w-full md:w-auto">
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-[#1F1B40] to-[#2A2B4A] flex items-center justify-center relative overflow-hidden">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-white/5"></div>
                  <User className="w-6 h-6 text-[#8E90B0]" />
                </>
              )}
            </div>
            <div>
              <p className="text-xs text-[#8E90B0]">Logged in as</p>
              <p className="text-sm font-semibold text-white">{displayName}</p>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="flex flex-wrap justify-between items-center pt-6 border-t border-[#2A2B4A]/50 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Trophy className="w-4 h-4 text-[#F58320]" />
            <span className="font-medium text-white">{nftCount} NFTs Won</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Zap className="w-4 h-4 text-[#F58320]" />
            <span className="font-medium text-white">
              Level {user?.level ?? 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
