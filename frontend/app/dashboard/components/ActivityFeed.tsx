"use client";

import { useState, useEffect } from "react";
import { Activity, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { gamificationApi, type XpEvent } from "@/lib/api/gamification";

// Map reason to icon and title
function getActivityDisplay(reason: string) {
  const map: Record<string, { icon: string; title: string }> = {
    LESSON_STEP_COMPLETE: { icon: "🎓", title: "Completed a lesson step" },
    QUIZ_PASS: { icon: "✅", title: "Passed a quiz" },
    QUIZ_PERFECT: { icon: "🌟", title: "Perfect quiz score!" },
    DAILY_STREAK: { icon: "🔥", title: "Daily streak bonus" },
    FIRST_CONTRACT: { icon: "🚀", title: "Deployed first contract" },
    MODULE_COMPLETE: { icon: "🏆", title: "Completed a module" },
    GALLERY_SUBMIT: { icon: "🎨", title: "Submitted project to gallery" },
  };
  return map[reason] || { icon: "⭐", title: reason };
}

function timeAgo(date: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return `${Math.floor(weeks / 4)}mo ago`;
}

export default function ActivityFeed() {
  const { isAuthenticated } = useAuth();
  const [activities, setActivities] = useState<XpEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    gamificationApi
      .getMyActivity(1, 10)
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res)
          ? res
          : ((res as { data?: XpEvent[] })?.data ?? []);
        setActivities(list);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <div className="bg-[#1A1A24]/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm h-full">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        <Activity className="text-brand-orange w-5 h-5" />
        Activity Feed
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
        </div>
      ) : activities.length > 0 ? (
        <div className="relative border-l border-gray-800 ml-3 space-y-8 pb-4">
          {activities.map((activity) => {
            const display = getActivityDisplay(activity.reason);
            return (
              <div key={activity.id} className="relative pl-6">
                {/* Timeline Dot */}
                <div className="absolute -left-3.5 top-0.5 w-7 h-7 bg-[#1A1A24] border border-gray-700 rounded-full flex items-center justify-center text-xs">
                  {display.icon}
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <p className="text-white text-sm font-medium">
                      {display.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {timeAgo(activity.createdAt)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded self-start">
                    +{activity.amount} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">
          No activity yet. Start learning to earn XP!
        </div>
      )}

      {!loading && activities.length > 0 && (
        <button className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white border border-transparent hover:border-gray-800 rounded-lg transition-colors">
          Load More Activity
        </button>
      )}
    </div>
  );
}
