"use client";

import { useEffect, useState } from "react";
import { usersApi, UserProfile, UserStats } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface UseProfileResult {
  profile: UserProfile | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
}

export function useProfile(userId?: string): UseProfileResult {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If a specific userId is given, fetch that user's public profile + stats
    if (userId) {
      setLoading(true);
      Promise.all([usersApi.getById(userId), usersApi.getStats(userId)])
        .then(([p, s]) => {
          setProfile(p);
          setStats(s);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
      return;
    }

    // Otherwise load the authenticated user's own profile
    if (isAuthenticated && user) {
      setProfile(user);
      setLoading(true);
      usersApi
        .getStats(user.id)
        .then(setStats)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [userId, isAuthenticated, user]);

  return { profile, stats, loading, error };
}
