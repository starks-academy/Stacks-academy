"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Lock,
  Award,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { certificatesApi, Certificate } from "@/lib/api/certificates";
import { useAuth } from "@/context/AuthContext";

export default function FinalAssessmentCard() {
  const { isAuthenticated } = useAuth();
  const [eligible, setEligible] = useState(false);
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  const [cert, setCert] = useState<Certificate | null>(null);
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    certificatesApi
      .checkEligibility()
      .then((e) => {
        setEligible(e.isEligible);
        setAlreadyMinted(e.alreadyMinted);
        if (e.certificate) setCert(e.certificate);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleMint = async () => {
    setMinting(true);
    setMintError(null);
    try {
      const minted = await certificatesApi.mint({ moduleId: 0, score: 100 });
      setCert(minted);
      setAlreadyMinted(true);
      setEligible(false);
    } catch (e: unknown) {
      setMintError(
        e instanceof Error ? e.message : "Minting failed. Please try again.",
      );
    } finally {
      setMinting(false);
    }
  };

  const isUnlocked = eligible || alreadyMinted;

  return (
    <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto my-16">
      {/* Connector icon */}
      <div className="hidden md:flex flex-col items-center justify-center mb-8 relative z-10">
        <div
          className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg ${
            alreadyMinted
              ? "bg-[#0A0B1A] border-[#22C55E]"
              : isUnlocked
                ? "bg-[#0A0B1A] border-[#F58320]"
                : "bg-[#14152C] border-[#2A2B4A]"
          }`}
        >
          {alreadyMinted ? (
            <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
          ) : isUnlocked ? (
            <Trophy className="w-5 h-5 text-[#F58320]" />
          ) : (
            <Lock className="w-5 h-5 text-[#8E90B0]" />
          )}
        </div>
      </div>

      <div
        className={`w-full md:w-[60%] lg:w-[50%] p-1 rounded-2xl shadow-[0_0_30px_rgba(245,131,32,0.3)] transition-opacity ${
          isUnlocked ? "opacity-100" : "opacity-90 hover:opacity-100"
        } bg-linear-to-br from-[#F58320] via-purple-700 to-transparent`}
      >
        <div className="bg-[#14152C] p-8 rounded-xl h-full border border-black flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(245,131,32,0.1)_0,transparent_70%)] pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#F58320] to-[#FF4500] shadow-[0_0_20px_rgba(245,131,32,0.5)] flex items-center justify-center mb-6 relative z-10">
            <Trophy className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">
            Certification & Final
            <br />
            Assessment
          </h2>

          <p className="text-[#8E90B0] text-sm mb-6 max-w-sm relative z-10">
            {alreadyMinted
              ? "You've earned your official Stacks Developer Certificate. It's permanently recorded on the Stacks blockchain."
              : isUnlocked
                ? "Congratulations! You've completed all modules. Mint your official Stacks Developer Certificate as an NFT."
                : "Complete all preceding modules to unlock certification and final assessment to earn your official Stacks Developer Certificate."}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
            {["30 Questions", "1 Assessment", "Certificate"].map((tag) => (
              <span
                key={tag}
                className={`border text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                  isUnlocked
                    ? "bg-[#F58320]/10 border-[#F58320]/30 text-[#F58320]"
                    : "bg-[#0A0B1A] border-[#2A2B4A] text-[#8E90B0]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isUnlocked ? "bg-[#F58320]" : "bg-[#8E90B0]"}`}
                />
                {tag}
              </span>
            ))}
          </div>

          {mintError && (
            <p className="text-red-400 text-sm mb-4 relative z-10">
              {mintError}
            </p>
          )}

          <div className="w-full relative z-10">
            {loading ? (
              <div className="flex justify-center py-3">
                <Loader2 className="w-6 h-6 text-[#F58320] animate-spin" />
              </div>
            ) : alreadyMinted && cert?.txId ? (
              <a
                href={`https://explorer.hiro.so/txid/${cert.txId}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#22C55E]/10 border border-[#22C55E]/40 text-[#22C55E] rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#22C55E]/20 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" /> Certificate Minted
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            ) : alreadyMinted ? (
              <Link href="/certificates" className="w-full block">
                <button className="w-full py-4 bg-[#22C55E]/10 border border-[#22C55E]/40 text-[#22C55E] rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#22C55E]/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5" /> View My Certificate
                </button>
              </Link>
            ) : eligible ? (
              <button
                onClick={handleMint}
                disabled={minting}
                className="w-full py-4 bg-linear-to-r from-[#F58320] to-[#FFB067] text-[#0A0B1A] rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,131,32,0.5)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {minting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Minting…
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" /> Mint NFT Certificate
                  </>
                )}
              </button>
            ) : (
              <button
                className="w-full py-4 bg-linear-to-r from-[#593CAE] to-[#2B1B54] text-[#B0A3EB] rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed border border-[#3E2A76]"
                disabled
              >
                Complete all modules to unlock{" "}
                <Trophy className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
