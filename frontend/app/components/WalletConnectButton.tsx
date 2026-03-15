"use client";

import { useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Wallet, LogOut, ChevronDown } from "lucide-react";

function truncate(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export default function WalletConnectButton() {
  const { authenticate } = useConnect();
  const { user, isAuthenticated, isLoading, requestChallenge, completeLogin, logout } =
    useAuth();
  const [connecting, setConnecting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      // Step 1: Start Stacks wallet auth flow
      authenticate({
        appDetails: {
          name: "Stacks Academy",
          icon: typeof window !== "undefined" ? `${window.location.origin}/favicon.ico` : "",
        },
        onFinish: async ({ userSession }) => {
          try {
            const userData = userSession.loadUserData();
            const walletAddress =
              userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
            const publicKey = userData.appPrivateKey; // used for verification

            // Step 2: Get challenge message
            const message = await requestChallenge(walletAddress);

            // Step 3: Sign the message
            const { signMessage } = await import("@stacks/connect");
            await signMessage({
              message,
              userSession,
              onFinish: async ({ signature }) => {
                // Step 4: Verify signature and get JWT
                await completeLogin(walletAddress, signature, publicKey);
                setConnecting(false);
              },
              onCancel: () => {
                setConnecting(false);
              },
            });
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Sign-in failed");
            setConnecting(false);
          }
        },
        onCancel: () => setConnecting(false),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-36 h-10 bg-white/10 rounded-md animate-pulse" />
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {/* Level badge */}
          <span className="bg-brand-orange text-white text-xs font-bold px-1.5 py-0.5 rounded">
            Lv{user.level}
          </span>
          <span className="font-mono">{truncate(user.walletAddress)}</span>
          {user.role === "admin" && (
            <span className="bg-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              ADMIN
            </span>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-[#1A1A24] border border-gray-700 rounded-lg shadow-xl z-50 py-1">
            <div className="px-3 py-2 border-b border-gray-700">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate">
                {user.displayName || truncate(user.walletAddress)}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="flex items-center gap-2 bg-brand-orange hover:bg-orange-500 disabled:opacity-70 text-white font-medium px-6 py-2.5 rounded-md transition-colors shadow-[0_0_15px_rgba(245,131,32,0.3)] text-sm"
      >
        {connecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {connecting ? "Connecting…" : "Connect Wallet"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
