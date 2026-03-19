"use client";
import { Award, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { gamificationApi } from "@/lib/api";

interface Badge {
  id?: string;
  name?: string;
  badgeName?: string;
  description?: string;
  icon?: string;
  date?: string;
}

export default function NFTShowcase() {
  const { isAuthenticated } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    gamificationApi
      .getMyBadges()
      .then((data) => {
        if (!cancelled) {
          setBadges(data as Badge[]);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <div className="bg-[#1A1A24]/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Award className="text-brand-orange w-5 h-5" />
          Earned Badges & NFTs
        </h2>
        <button className="text-sm text-brand-orange hover:text-orange-400 font-medium">
          View All Explorer -&gt;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
          </div>
        ) : badges.length > 0 ? (
          badges.map((nft, index) => (
            <div
              key={nft.id || index}
              className="group relative rounded-xl border border-gray-800 bg-black/40 overflow-hidden hover:border-brand-orange/50 transition-all duration-300"
            >
              <div
                className={`h-32 w-full bg-linear-to-br from-brand-orange to-purple-500 opacity-20 group-hover:opacity-30 transition-opacity`}
              ></div>

              <div className="absolute top-0 left-0 w-full h-32 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-3xl shadow-2xl backdrop-blur-md transform group-hover:scale-110 transition-transform duration-300">
                  {nft.icon || "🏆"}
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs text-gray-500 mb-1">
                  {nft.date || "Just now"}
                </div>
                <h3 className="text-white font-bold mb-2 group-hover:text-brand-orange transition-colors">
                  {nft.name || nft.badgeName}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {nft.description}
                </p>
              </div>

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono border border-gray-800 text-gray-300">
                  #STX-{nft.id || "000"}042
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-6">
            No badges earned yet.
          </div>
        )}

        {/* Empty Slot */}
        <div className="rounded-xl border border-gray-800 border-dashed bg-transparent flex items-center justify-center h-[230px] opacity-50 hover:opacity-100 hover:border-gray-600 transition-all cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">
              Unlock more by learning
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
