"use client";

import { useEffect, useState } from "react";
import { gamificationApi, XpInfo, StreakInfo } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface UseXpResult {
  xpInfo: XpInfo | null;
  streak: StreakInfo | null;
  loading: boolean;
  error: string | null;
}

export function useXp(): UseXpResult {
  const { isAuthenticated } = useAuth();
  const [xpInfo, setXpInfo] = useState<XpInfo | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    Promise.all([gamificationApi.getMyXp(), gamificationApi.getMyStreak()])
      .then(([xp, str]) => {
        setXpInfo(xp);
        setStreak(str);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return { xpInfo, streak, loading, error };
}
