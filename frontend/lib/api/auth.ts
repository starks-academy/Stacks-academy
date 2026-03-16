import { request } from "@/lib/api/client";
import type { AuthResponse, ChallengeResponse } from "@/lib/api/types";

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