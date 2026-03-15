"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi, usersApi, UserProfile } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Step 1: Request a sign challenge for a wallet address. Returns the message to sign. */
  requestChallenge: (walletAddress: string) => Promise<string>;
  /** Step 2: Submit the signed message to receive and store a JWT. */
  completeLogin: (
    walletAddress: string,
    signature: string,
    publicKey: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("sa_token");
    if (storedToken) {
      setToken(storedToken);
      usersApi
        .getMe()
        .then(setUser)
        .catch(() => {
          // Token is stale/invalid — clear it
          localStorage.removeItem("sa_token");
          localStorage.removeItem("sa_refresh_token");
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const requestChallenge = useCallback(async (walletAddress: string) => {
    const challenge = await authApi.challenge(walletAddress);
    return challenge.message;
  }, []);

  const completeLogin = useCallback(
    async (walletAddress: string, signature: string, publicKey: string) => {
      const response = await authApi.verify(walletAddress, signature, publicKey);
      localStorage.setItem("sa_token", response.accessToken);
      localStorage.setItem("sa_refresh_token", response.refreshToken);
      setToken(response.accessToken);
      setUser(response.user);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("sa_token");
    localStorage.removeItem("sa_refresh_token");
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await usersApi.getMe();
    setUser(profile);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        requestChallenge,
        completeLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
