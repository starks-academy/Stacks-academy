"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Award,
  ExternalLink,
  Loader2,
  Lock,
  Check,
} from "lucide-react";
import { certificatesApi, Certificate } from "@/lib/api/certificates";
import { useAuth } from "@/context/AuthContext";

const MODULE_NAMES: Record<number, string> = {
  1: "Bitcoin Fundamentals",
  2: "Lightning Network",
  3: "Clarity Smart Contracts",
  4: "Stacks Blockchain",
  5: "DeFi on Bitcoin",
  6: "Advanced dApp Development",
};

const MODULE_COLORS: Record<number, string> = {
  1: "from-orange-500 to-amber-600",
  2: "from-yellow-400 to-orange-500",
  3: "from-purple-500 to-indigo-600",
  4: "from-cyan-500 to-blue-600",
  5: "from-emerald-500 to-teal-600",
  6: "from-pink-500 to-rose-600",
};

export default function CertificatesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mintingId, setMintingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    certificatesApi
      .getMyCerts()
      .then(setCerts)
      .catch(() => setError("Failed to load certificates."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading]);

  const handleMint = async (cert: Certificate) => {
    if (cert.txId) return; // already minted
    setMintingId(cert.moduleId);
    try {
      const updated = await certificatesApi.mint({
        moduleId: cert.moduleId,
        score: cert.score,
      });
      setCerts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch {
      setError("Minting failed. Please try again.");
    } finally {
      setMintingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0A0B1A] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0A0B1A] pt-28 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <Lock className="w-16 h-16 text-gray-600 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-3">
          Connect Your Wallet
        </h1>
        <p className="text-gray-400 max-w-md">
          Please connect your Stacks wallet to view and mint your certificates.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0B1A] pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Shield className="w-4 h-4" />
          SIP-009 NFT Certificates
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Your Certificates
        </h1>
        <p className="text-lg text-gray-400">
          Earn certificates by completing course modules. Mint them as NFTs
          permanently recorded on the Stacks blockchain.
        </p>
      </div>

      {error && (
        <div className="mb-8 text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4 max-w-lg mx-auto">
          {error}
        </div>
      )}

      {certs.length === 0 ? (
        <div className="text-center py-20">
          <Award className="w-16 h-16 text-gray-700 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No certificates yet
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto">
            Complete course modules and pass their final assessments to earn
            your certificates here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => {
            const gradientClass =
              MODULE_COLORS[cert.moduleId] ?? "from-gray-500 to-gray-700";
            const moduleName =
              MODULE_NAMES[cert.moduleId] ?? `Module ${cert.moduleId}`;
            const isMinting = mintingId === cert.moduleId;
            const isMinted = !!cert.txId;

            return (
              <div
                key={cert.id}
                className="group relative bg-[#1A1A24]/60 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-gray-600 transition-all duration-300"
              >
                {/* Top gradient strip */}
                <div className={`h-2 w-full bg-linear-to-r ${gradientClass}`} />

                <div className="p-6">
                  {/* Icon & module */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradientClass} flex items-center justify-center shadow-lg`}
                    >
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                        isMinted
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-gray-800 border-gray-700 text-gray-400"
                      }`}
                    >
                      {isMinted ? (
                        <>
                          <Check className="w-3 h-3" /> Minted on-chain
                        </>
                      ) : (
                        "Not yet minted"
                      )}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-orange transition-colors">
                    {moduleName}
                  </h3>
                  <p className="text-sm text-gray-400 mb-1">
                    Score:{" "}
                    <span className="text-white font-semibold">
                      {cert.score}%
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mb-6">
                    Earned:{" "}
                    {new Date(cert.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/* Action */}
                  {isMinted ? (
                    <a
                      href={`https://explorer.hiro.so/txid/${cert.txId}?chain=mainnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm font-medium transition-all duration-200"
                    >
                      View on Explorer
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={() => handleMint(cert)}
                      disabled={isMinting}
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-linear-to-r ${gradientClass} text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isMinting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Minting…
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Mint NFT Certificate
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-16 bg-linear-to-r from-brand-orange/10 via-purple-500/10 to-brand-orange/10 border border-gray-800 rounded-2xl p-8 text-center backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-2">
          About Your Certificates
        </h3>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto">
          Each certificate is a SIP-009 compliant NFT permanently stored on the
          Stacks blockchain, anchored to Bitcoin. They are verifiable proof of
          your learning achievements that you truly own — no platform can revoke
          them.
        </p>
      </div>
    </main>
  );
}
